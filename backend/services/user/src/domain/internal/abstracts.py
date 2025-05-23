from abc import ABC, abstractmethod

from fastdbx.core.repo import AbstractRepository

from src.domain.models import User


class AbstractUserRepository(AbstractRepository[User], ABC):

    @abstractmethod
    def find_by_role(self, role: str):
        pass
