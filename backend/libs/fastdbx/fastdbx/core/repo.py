from abc import abstractmethod
from typing import TypeVar, Generic, Optional

from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from fastdbx.core.datasource import Datasource
from fastdbx.core.model import BaseEntity

T = TypeVar("T", bound=BaseEntity)


class AbstractRepository(Generic[T]):

    @abstractmethod
    def find_all(self) -> list[T]:
        pass

    @abstractmethod
    def find_by_id(self, id: int) -> Optional[T]:
        pass

    @abstractmethod
    def save(self, instance: T, **data) -> T:
        pass

    @abstractmethod
    def delete_by_id(self, id: int) -> bool:
        pass


class CrudRepository(AbstractRepository[T]):

    def __init__(self, entity: T):
        self._datasource = Datasource.instance()
        self.entity = entity

    @property
    def session(self) -> Session:
        return self._datasource.context

    def find_all(self) -> list[T]:
        statement = select(self.entity)
        result = self.session.scalars(statement).all()
        return result

    def find_by_id(self, id: int) -> Optional[T]:
        statement = select(self.entity).where(self.entity.id == id)
        result = self.session.scalars(statement).first()
        return result

    def save(self, instance: T, **data) -> T:
        """Insert or update"""
        if not data:
            self.session.add(instance)
            self.session.flush()
            self.session.refresh(instance)
            return instance

        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
            else:
                raise AttributeError(
                    f"{type(instance).__name__} has no attribute: {key}"
                )

        self.session.flush()
        return instance

    def delete_by_id(self, id: int) -> bool:
        statement = delete(self.entity).where(self.entity.id == id)
        result = self.session.execute(statement)
        return result.rowcount == 1
