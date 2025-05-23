import logging
from decimal import Decimal

from fastapi import Depends
from fastdbx.transactions.meta import transactional
from sqlalchemy.exc import SQLAlchemyError

from src.domain.dtos.sale import SaleItemDto, MostSoldMedicationDto, SaleTrendDto
from src.domain.internal.abstracts import AbstractInventoryRepository, AbstractSaleRepository
from src.domain.internal.medication_client import MedicationClient
from src.domain.models import SaleItem, Sale
from src.domain.validations.exceptions import (
    InsufficientInventoryException,
    UnknownEmployeeException,
)
from src.repository.inventory_repo import InventoryRepository
from src.repository.sale_repo import SaleRepository
from src.service.medication_api_client import MockMedicationApiClient

logger = logging.getLogger("uvicorn.error")


class SaleService:

    def __init__(
        self,
        inventory_repo: AbstractInventoryRepository = Depends(InventoryRepository),
        sale_repo: AbstractSaleRepository = Depends(SaleRepository),
        medication_client: MedicationClient = Depends(MockMedicationApiClient),
    ):
        self.inventory_repo = inventory_repo
        self.sale_repo = sale_repo
        self.medication_client = medication_client

    def __call__(self, *args, **kwargs):
        return SaleService()

    @transactional()
    def get_most_sold_medications(
        self, manager_id: int, limit: int
    ) -> list[MostSoldMedicationDto]:
        rows = self.sale_repo.find_medication_qsum_by_manager_id_limit(
            manager_id, limit
        )

        medication_ids = [row.medication_id for row in rows]
        medications = self.medication_client.get_medications_by_ids(ids=medication_ids)
        result = []

        for medication in medications:
            row = next((r for r in rows if r.medication_id == medication.id), None)
            if row is not None:
                result.append(
                    MostSoldMedicationDto(
                        medication_id=medication.id,
                        name=medication.name,
                        quantity=row.q,
                        manufacturer=medication.manufacturer,
                    )
                )

        return result

    @transactional()
    def get_sale_trends_past_days(self, manager_id, days: int) -> list[SaleTrendDto]:
        sale_trends = self.sale_repo.find_date_scount_tsum_by_manager_id_days(manager_id, days)
        return [SaleTrendDto.model_validate(trend) for trend in sale_trends]

    @transactional(
        rollback_for=(
            InsufficientInventoryException,
            SQLAlchemyError,
            UnknownEmployeeException,
            Exception,
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

            if inventory is None:
                raise UnknownEmployeeException(
                    detail=f"Can't sell medication {item.medication_id}"
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
                SaleItem(
                    medication_id=item.medication_id,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                )
            )

        self.sale_repo.save(
            instance=Sale(
                total_amount=total_amount,
                employee_id=employee_id,
                pharmacy_id=pharmacy_id,
                sale_items=sold_items,
            )
        )
