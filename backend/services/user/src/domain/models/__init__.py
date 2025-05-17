from enum import Enum

from fastdbx.core import BaseEntity
from sqlalchemy import Column, Integer, String


class BaseEnum(Enum):

    @classmethod
    def is_valid(cls, value: str) -> bool:
        return value in cls.values()

    @classmethod
    def values(cls):
        return set(map(lambda c: c.value, cls))


class Role(BaseEnum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"


class NotificationPreference(BaseEnum):
    EMAIL = "EMAIL"
    SMS = "SMS"


class User(BaseEntity):
    __tablename__ = 'user'

    id: int = Column(Integer, primary_key=True)
    email: str = Column(String, unique=True, nullable=False)
    password: str = Column(String, nullable=False)
    phone_number: str = Column(String(10), nullable=False)
    role: str = Column(String, nullable=False)
    notification_preference: str = Column(String, nullable=True)
