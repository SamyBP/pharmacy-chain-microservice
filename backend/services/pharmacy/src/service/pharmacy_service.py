import logging

from fastapi import Depends
from fastdbx.transactions.meta import transactional

from src.domain.dtos.employee import SyncEmployeeToPharmacyDto
from src.domain.dtos.medication import MedicationDto
from src.domain.dtos.pharmacy import PharmacyDto
from src.domain.internal.abstracts import (
    AbstractInventoryRepository,
    AbstractPharmacyRepository,
    AbstractSaleRepository,
)
from src.domain.internal.medication_client import MedicationClient
from src.domain.internal.syncs import AddEmployeeStrategy, AddManagerStrategy
from src.repository.inventory_repo import InventoryRepository
from src.repository.pharmacy_repo import PharmacyRepository
from src.repository.sale_repo import SaleRepository
from src.service.medication_api_client import MockMedicationApiClient

logger = logging.getLogger("uvicorn.error")


class PharmacyService:

    def __init__(
            self,
            inventory_repo: AbstractInventoryRepository = Depends(InventoryRepository),
            pharmacy_repo: AbstractPharmacyRepository = Depends(PharmacyRepository),
            sale_repo: AbstractSaleRepository = Depends(SaleRepository),
            medication_client: MedicationClient = Depends(MockMedicationApiClient),
    ):
        self.inventory_repo = inventory_repo
        self.pharmacy_repo = pharmacy_repo
        self.sale_repo = sale_repo
        self.medication_client = medication_client
        self.syncing_strategies = {
            "EMPLOYEE": AddEmployeeStrategy(self.pharmacy_repo),
            "MANAGER": AddManagerStrategy(self.pharmacy_repo)
        }

    def __call__(self, *args, **kwargs):
        return PharmacyService()

    @transactional()
    def get_not_expired_medications(self) -> list[MedicationDto]:
        not_expired_medication_ids = [
            i.medication_id for i in self.inventory_repo.find_by_expiration_date_gt()
        ]
        return self.medication_client.get_medications_by_ids(
            ids=not_expired_medication_ids
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
            for i in self.inventory_repo.find_by_pharmacy_employee_id(
                pharmacy_id, employee_id
            )
        ]
        return self.medication_client.get_medications_by_ids(ids=medication_ids)

    @transactional()
    def get_pharmacies_by_user_and_role(self, user_id: int, role: str) -> list[int]:
        if role == "EMPLOYEE":
            return self.pharmacy_repo.find_all_by_employee_id(employee_id=user_id)
        if role == "MANAGER":
            return self.pharmacy_repo.find_all_by_manager_id(manager_id=user_id)

        return []

    @transactional()
    def sync_user_to_pharmacy(self, payload: SyncEmployeeToPharmacyDto):
        sync_service = self.syncing_strategies.get(payload.role)
        ph = self.pharmacy_repo.find_by_id(payload.pharmacy_id)
        sync_service.sync_user(ph, user_id=payload.user_id)
