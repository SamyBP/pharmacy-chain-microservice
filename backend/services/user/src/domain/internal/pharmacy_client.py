from abc import ABC, abstractmethod

from src.domain.models import Role


class PharmacyClient(ABC):

    @abstractmethod
    def get_pharmacies_by_user_and_role(self, user_id: int, role: Role) -> list[int]:
        pass

    @abstractmethod
    def set_user_at_pharmacy(self, user_id: int, pharmacy_id, role: Role):
        pass