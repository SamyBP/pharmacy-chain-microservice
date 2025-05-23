from abc import ABC, abstractmethod
from datetime import datetime

from fastdbx.core.repo import AbstractRepository

from src.domain.models import Inventory, Pharmacy, Sale


class AbstractInventoryRepository(AbstractRepository[Inventory], ABC):

    @abstractmethod
    def find_by_expiration_date_gt(
        self, expiration_date: datetime = datetime.now()
    ) -> list[Inventory]:
        pass

    @abstractmethod
    def find_by_pharmacy_employee_id(
        self, pharmacy_id: int, employee_id: int
    ) -> list[Inventory]:
        pass

    @abstractmethod
    def find_by_pharmacy_and_medication(
        self, pharmacy_id: int, medication_id: int
    ) -> Inventory:
        pass


class AbstractPharmacyRepository(AbstractRepository[Pharmacy], ABC):

    @abstractmethod
    def find_by_medication_id_quantity_gt0_exp_gt_now(
        self, medication_id: int
    ) -> list[Pharmacy]:
        pass


class AbstractSaleRepository(AbstractRepository[Sale], ABC):

    @abstractmethod
    def find_medication_qsum_by_manager_id_limit(self, manager_id: int, limit: int):
        pass

    @abstractmethod
    def find_date_scount_tsum_by_manager_id_days(self, manager_id, days: int):
        pass
