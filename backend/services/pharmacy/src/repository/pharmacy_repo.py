from fastdbx.core import CrudRepository
from sqlalchemy import select

from src.domain.internal.abstracts import AbstractPharmacyRepository
from src.domain.models import Pharmacy, Inventory
from datetime import datetime


class PharmacyRepository(AbstractPharmacyRepository, CrudRepository[Pharmacy]):

    def __init__(self):
        super().__init__(Pharmacy)

    def __call__(self, *args, **kwargs):
        return PharmacyRepository()

    def find_by_medication_id_quantity_gt0_exp_gt_now(
        self, medication_id: int
    ) -> list[Pharmacy]:
        statement = (
            select(Pharmacy)
            .join(Inventory)
            .where(
                Inventory.medication_id == medication_id,
                Inventory.quantity > 0,
                Inventory.expiration_date > datetime.now(),
            )
            .distinct()
        )

        return self.session.scalars(statement).all()
