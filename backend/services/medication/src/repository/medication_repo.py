from fastdbx.core.repo import CrudRepository
from src.domain.internal.abstracts import AbstractMedicationRepository

from src.domain.models import Medication, MedicationImage


class MedicationRepository(AbstractMedicationRepository, CrudRepository):
    def __init__(self) -> None:
        super().__init__(Medication)

    def __call__(self, *args, **kwargs):
        return MedicationRepository()

    def find_by_ids(self, ids: list[int]) -> list[Medication]:
        return self.session.query(Medication).filter(Medication.id.in_(ids))

    def save_image(self, image: MedicationImage) -> MedicationImage:
        self.session.add(image)
        self.session.flush()
        return image
