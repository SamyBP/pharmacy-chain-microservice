from decimal import Decimal

from fastapi import Depends
from fastdbx.transactions.meta import transactional
from sqlalchemy.exc import SQLAlchemyError

from src.domain.dtos.medication import MedicationDto
from src.domain.dtos.pharmacy import PharmacyDto
from src.domain.dtos.sale import SaleItemDto
from src.domain.models import SaleItem, Sale
from src.domain.validations.exceptions import (
    InsufficientInventoryException,
    UnknownEmployeeException,
)
from src.repository.inventory_repo import InventoryRepository
from src.repository.pharmacy_repo import PharmacyRepository
from src.repository.sale_repo import SaleRepository
from src.service.medication_api_client import MedicationApiClient


class PharmacyService:

    def __init__(
        self,
        inventory_repo: InventoryRepository = Depends(InventoryRepository),
        pharmacy_repo: PharmacyRepository = Depends(PharmacyRepository),
        sale_repo: SaleRepository = Depends(SaleRepository),
        medication_api_client: MedicationApiClient = Depends(MedicationApiClient),
    ):
        self.inventory_repo = inventory_repo
        self.pharmacy_repo = pharmacy_repo
        self.sale_repo = sale_repo
        self.medication_api_client = medication_api_client

    def __call__(self, *args, **kwargs):
        return PharmacyService()

    @transactional()
    def get_not_expired_medications(self) -> list[MedicationDto]:
        not_expired_medication_ids = [
            i.medication_id for i in self.inventory_repo.find_by_expiration_date_gt()
        ]
        return self.medication_api_client.get_medications_by_id(
            ids=not_expired_medication_ids, use_mock=True
        )

    @transactional()
    def get_pharmacies_for_medication(self, medication_id) -> list[PharmacyDto]:
        pharmacies = self.pharmacy_repo.find_by_medication_id_quantity_gt0_exp_gt_now(
            medication_id
        )
        return [PharmacyDto.model_validate(p) for p in pharmacies]

    @transactional()
    def get_medications_from_pharmacy(
        self, pharmacy_id: int, *, employee_id: int
    ) -> list[MedicationDto]:
        medication_ids = [
            i.medication_id
            for i in self.inventory_repo.find_by_pharmacy_employee_id(pharmacy_id, employee_id)
        ]
        return self.medication_api_client.get_medications_by_id(
            ids=medication_ids, use_mock=True
        )

    @transactional(
        rollback_for=(
            InsufficientInventoryException,
            SQLAlchemyError,
            UnknownEmployeeException,
            Exception
        )
    )
    def place_sale_at_pharmacy(
        self, employee_id: int, pharmacy_id: int, items: list[SaleItemDto]
    ):
        sold_items: list[SaleItem] = []
        total_amount = Decimal(0)

        for item in items:
            inventory = self.inventory_repo.find_by_pharmacy_and_medication(
                pharmacy_id=pharmacy_id, medication_id=item.medication_id
            )

            if not inventory.pharmacy.is_known_employee(employee_id=employee_id):
                raise UnknownEmployeeException(
                    detail=f"Employee {employee_id} is not authorized to perform sales at pharmacy {pharmacy_id}"
                )

            if inventory.quantity < item.quantity:
                raise InsufficientInventoryException(
                    detail=f"Can't sell {item.quantity} of medication {item.medication_id}"
                )

            self.inventory_repo.save(
                instance=inventory, quantity=inventory.quantity - item.quantity
            )

            total_amount += Decimal(item.unit_price) * item.quantity
            sold_items.append(
                SaleItem(medication_id=item.medication_id, quantity=item.quantity, unit_price=item.unit_price)
            )

        self.sale_repo.save(
            instance=Sale(
                total_amount=total_amount,
                employee_id=employee_id,
                pharmacy_id=pharmacy_id,
                sale_items=sold_items
            )
        )
