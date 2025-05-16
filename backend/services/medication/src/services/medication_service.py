from src.domain.dtos.medication import MedicationOut, MedicationIn
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
    def get_all_medications(self) -> list[MedicationOut]:
        medications = self.medication_repo.find_all()
        return [MedicationOut.model_validate(m) for m in medications]

    @transactional()
    def create_medication(self, payload: MedicationIn) -> MedicationOut:
        medication = self.medication_repo.save(
            instance=Medication(**payload.model_dump())
        )

        return MedicationOut.model_validate(medication)
