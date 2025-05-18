from fastapi import Depends
from fastdbx.transactions.meta import transactional

from src.domain.dtos.pharmacy import PharmacyDto
from src.repository.inventory_repo import InventoryRepository
from src.domain.dtos.medication import MedicationDto
from src.repository.pharmacy_repo import PharmacyRepository
from src.service.medication_api_client import MedicationApiClient


class PharmacyService:

    def __init__(
        self,
        inventory_repo: InventoryRepository = Depends(InventoryRepository),
        pharmacy_repo: PharmacyRepository = Depends(PharmacyRepository),
        medication_api_client: MedicationApiClient = Depends(MedicationApiClient)
    ):
        self.inventory_repo = inventory_repo
        self.pharmacy_repo = pharmacy_repo
        self.medication_api_client = medication_api_client

    def __call__(self, *args, **kwargs):
        return PharmacyService()

    @transactional()
    def get_not_expired_medications(self) -> list[MedicationDto]:
        not_expired_medication_ids = [
            i.id for i in self.inventory_repo.find_by_expiration_date_gt()
        ]
        return self.medication_api_client.get_medications_by_id(
            ids=not_expired_medication_ids, use_mock=True
        )

    @transactional()
    def get_pharmacies_for_medication(self, medication_id) -> list[PharmacyDto]:
        pharmacies = self.pharmacy_repo.find_by_medication_id_quantity_gt0_exp_gt_now(medication_id)
        return [PharmacyDto.model_validate(p) for p in pharmacies]
