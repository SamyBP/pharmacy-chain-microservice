from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped

from fastdbx.core.model import BaseEntity


class Medication(BaseEntity):
    __tablename__ = "medication"

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String, nullable=False)
    description: str = Column(String, nullable=False)
    purchase_price: Decimal = Column(Numeric(5, 2), nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.now, nullable=False)

    manufacturer_id: Optional[int] = Column(Integer, ForeignKey("manufacturer.id"), nullable=True)

    images: Mapped[list["MedicationImage"]] = relationship("MedicationImage", back_populates="medication")
    manufacturer: Mapped["Manufacturer"] = relationship("Manufacturer", back_populates="medications")


class MedicationImage(BaseEntity):
    __tablename__ = "medicationimage"

    id: int = Column(Integer, primary_key=True)
    image_url: str = Column(String, nullable=False)
    alt_text: str = Column(String, nullable=False)

    medication_id: Optional[int] = Column(Integer, ForeignKey("medication.id"), nullable=True)
    medication: Mapped[Medication] = relationship("Medication", back_populates="images")


class Manufacturer(BaseEntity):
    __tablename__ = "manufacturer"

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String, nullable=False)
    contact_info: str = Column(String, nullable=False)

    medications: Mapped[list[Medication]] = relationship("Medication", back_populates="manufacturer")
