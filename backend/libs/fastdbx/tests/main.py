import unittest

from sqlalchemy import Column, Text, Integer

from fastdbx import CrudRepository, Datasource
from fastdbx.core import BaseEntity
from fastdbx.transactions.meta import transactional


class Item(BaseEntity):
    __tablename__ = "item"

    id: int = Column(Integer, primary_key=True)
    name: str = Column(Text)


class ItemRepository(CrudRepository):
    def __init__(self):
        super().__init__(Item)


class CustomException(Exception):
    pass


class ItemService:

    def __init__(self, repo: ItemRepository):
        self.repo = repo

    @transactional()
    def get_item_by_id(self, id: int) -> Item:
        return self.repo.find_by_id(id)

    @transactional()
    def get_all_items(self) -> list[Item]:
        return self.repo.find_all()

    @transactional()
    def create_item(self, name: str) -> Item:
        item_to_save = Item(name=name)
        return self.repo.save(item_to_save)

    @transactional()
    def update_item(self, item_id: int, name: str) -> Item:
        item_to_update = self.repo.find_by_id(item_id)
        return self.repo.save(item_to_update, name=name)

    @transactional()
    def delete_item(self, item_id: int):
        self.repo.delete_by_id(item_id)

    @transactional(rollback_for=CustomException)
    def batch_update(self, payload: list[(int, str)]) -> list[Item]:
        updated_items = []

        for item_id, item_name in payload:
            if not self.is_item_name_valid(item_name):
                raise CustomException(f"Could not update item {item_id}. Not updating anything")
            item_to_update = self.repo.find_by_id(item_id)
            updated_item = self.repo.save(item_to_update, name=item_name)
            updated_items.append(updated_item)

        return updated_items

    def is_item_name_valid(self, item_name: str) -> bool:
        return item_name != "invalid"


class TestItemService(unittest.TestCase):
    def setUp(self):
        Datasource._instance = Datasource()
        Datasource._instance.startup()
        self.item_service = ItemService(repo=ItemRepository())

    def tearDown(self):
        Datasource._instance.shutdown()

    def test_create_item(self):
        item = self.item_service.create_item("new item")
        self.assertIsNotNone(item)
        self.assertIsNotNone(item.id, "item id should not be None")
        self.assertEqual(item.name, "new item")

    def test_update_item(self):
        item = self.item_service.create_item("old name")
        updated = self.item_service.update_item(item.id, "new name")
        self.assertEqual(updated.name, "new name")

    def test_delete_item(self):
        item = self.item_service.create_item("to be deleted")
        self.item_service.delete_item(item.id)
        result = self.item_service.get_item_by_id(item.id)
        self.assertIsNone(result)

    def test_batch_update_success(self):
        i1 = self.item_service.create_item("item1")
        i2 = self.item_service.create_item("item2")

        payload = [(i1.id, "updated1"), (i2.id, "updated2")]
        updated_items = self.item_service.batch_update(payload)

        self.assertEqual(len(updated_items), 2)
        self.assertEqual(updated_items[0].name, "updated1")
        self.assertEqual(updated_items[1].name, "updated2")

    def test_batch_update_rollback_on_exception(self):
        i1 = self.item_service.create_item("item1")
        i2 = self.item_service.create_item("item2")

        payload = [(i1.id, "updated1"), (i2.id, "invalid")]

        with self.assertRaises(CustomException):
            self.item_service.batch_update(payload)

        refreshed_i1 = self.item_service.get_item_by_id(i1.id)
        refreshed_i2 = self.item_service.get_item_by_id(i2.id)

        self.assertEqual(refreshed_i1.name, "item1")
        self.assertEqual(refreshed_i2.name, "item2")

    def test_isItemNameValid_sessionContextIsNone(self):
        self.assertIsNone(Datasource._instance.context)

        is_item_name_valid = self.item_service.is_item_name_valid("valid")

        self.assertTrue(is_item_name_valid)
        self.assertIsNone(Datasource._instance.context)


if __name__ == "__main__":
    unittest.main()
