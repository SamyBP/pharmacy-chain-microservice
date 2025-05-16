from fastdbx.core.repo import CrudRepository

from src.domain.models import Medication


class MedicationRepository(CrudRepository[Medication]):
    def __init__(self) -> None:
        super().__init__(Medication)

    def __call__(self, *args, **kwargs):
        return MedicationRepository()
