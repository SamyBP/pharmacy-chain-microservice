from abc import ABC, abstractmethod

from fastdbx.core.repo import AbstractRepository
from src.domain.models import Manufacturer, Medication, MedicationImage


class AbstractMedicationRepository(AbstractRepository[Medication], ABC):

    @abstractmethod
    def find_by_ids(self, ids: list[int]) -> list[Medication]:
        pass

    @abstractmethod
    def save_image(self, image: MedicationImage) -> MedicationImage:
        pass


class AbstractManufacturerRepository(AbstractRepository[Manufacturer], ABC):
    pass
