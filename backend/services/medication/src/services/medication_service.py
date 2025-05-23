from typing import Optional

from src.domain.dtos.medication import MedicationDto, CreateMedicationRequest
from fastdbx.transactions.meta import transactional
from src.domain.models import Medication
from src.repository import MedicationRepository
from fastapi import Depends


class MedicationService:
    def __init__(self, medication_repo: MedicationRepository = Depends(MedicationRepository)) -> None:
        self.medication_repo = medication_repo

    def __call__(self, *args, **kwargs):
        return MedicationService()

    @transactional()
    def get_medications(self, ids: Optional[list[int]]) -> list[MedicationDto]:
        if ids:
            medications = self.medication_repo.find_by_ids(ids)
        else:
            medications = self.medication_repo.find_all()

        return [MedicationDto.model_validate(m) for m in medications]

    @transactional()
    def create_medication(self, payload: CreateMedicationRequest) -> MedicationDto:
        medication = self.medication_repo.save(
            instance=Medication(**payload.model_dump())
        )

        return MedicationDto.model_validate(medication)
