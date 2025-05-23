from fastdbx.core import CrudRepository
from sqlalchemy import select

from src.domain.internal.abstracts import AbstractInventoryRepository
from src.domain.models import Inventory, Pharmacy, PharmacyEmployee
from datetime import datetime


class InventoryRepository(AbstractInventoryRepository, CrudRepository[Inventory]):
    def __init__(self):
        super().__init__(Inventory)

    def __call__(self, *args, **kwargs):
        return InventoryRepository()

    def find_by_expiration_date_gt(
        self, expiration_date: datetime = datetime.now()
    ) -> list[Inventory]:
        statement = select(Inventory).where(
            self.entity.expiration_date > expiration_date
        )
        return self.session.scalars(statement).all()

    def find_by_pharmacy_employee_id(self, pharmacy_id: int, employee_id: int) -> list[Inventory]:
        statement = (
            select(Inventory)
            .join(Pharmacy, Inventory.pharmacy_id == Pharmacy.id)
            .join(PharmacyEmployee, Pharmacy.id == PharmacyEmployee.pharmacy_id)
            .where(PharmacyEmployee.employee_id == employee_id, Pharmacy.id == pharmacy_id)
        )

        return self.session.scalars(statement).all()

    def find_by_pharmacy_and_medication(
        self, pharmacy_id: int, medication_id: int
    ) -> Inventory:
        statement = select(Inventory).where(
            Inventory.pharmacy_id == pharmacy_id,
            Inventory.medication_id == medication_id,
        )

        return self.session.scalars(statement).first()
