from abc import ABC, abstractmethod
from src.domain.dtos.medication import MedicationDto


class MedicationClient(ABC):

    @abstractmethod
    def get_medications_by_ids(self, ids: list[int]) -> list[MedicationDto]:
        pass
