from enum import Enum

from fastdbx.core import BaseEntity
from sqlalchemy import Column, Integer, String, Enum as SqlEnum


class Role(Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"


class NotificationPreference(Enum):
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
