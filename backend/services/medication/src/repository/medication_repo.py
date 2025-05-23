from fastdbx.core.repo import CrudRepository

from src.domain.models import Medication


class MedicationRepository(CrudRepository[Medication]):
    def __init__(self) -> None:
        super().__init__(Medication)

    def __call__(self, *args, **kwargs):
        return MedicationRepository()

    def find_by_ids(self, ids: list[int]) -> list[Medication]:
        return self.session.query(Medication).filter(Medication.id.in_(ids))
