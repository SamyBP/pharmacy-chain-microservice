from abc import ABC, abstractmethod

from src.domain.models import Pharmacy, PharmacyEmployee
from src.repository.pharmacy_repo import PharmacyRepository


class AddUserStrategy(ABC):

    @abstractmethod
    def sync_user(self, pharmacy: Pharmacy, user_id: int):
        pass


class AddEmployeeStrategy(AddUserStrategy):

    def __init__(self, repo: PharmacyRepository):
        self._repo = repo

    def sync_user(self, pharmacy: Pharmacy, user_id: int):
        employee = PharmacyEmployee(
            pharmacy_id=pharmacy.id,
            employee_id=user_id
        )

        self._repo.session.add(employee)
        self._repo.session.flush()

class AddManagerStrategy(AddUserStrategy):
    def __init__(self, repo: PharmacyRepository):
        self._repo = repo

    def sync_user(self, pharmacy: Pharmacy, user_id: int):
        attrs_to_update = {"manager_id": user_id}
        self._repo.save(pharmacy, **attrs_to_update)