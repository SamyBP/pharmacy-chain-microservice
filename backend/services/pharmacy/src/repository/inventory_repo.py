from fastdbx.core import CrudRepository
from sqlalchemy import select

from src.domain.models import Inventory
from datetime import datetime


class InventoryRepository(CrudRepository[Inventory]):
    def __init__(self):
        super().__init__(Inventory)

    def __call__(self, *args, **kwargs):
        return InventoryRepository()

    def find_by_expiration_date_gt(self, expiration_date: datetime = datetime.now()) -> list[Inventory]:
        statement = select(Inventory).where(self.entity.expiration_date > expiration_date)
        return self.session.scalars(statement).all()
