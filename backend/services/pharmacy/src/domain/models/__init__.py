from datetime import datetime
from decimal import Decimal
from typing import Optional
from fastdbx.core import BaseEntity
from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, relationship


class Pharmacy(BaseEntity):
    __tablename__ = 'pharmacy'

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String, nullable=False)
    address: str = Column(String, nullable=False)
    is_active: bool = Column(Boolean, default=True)
    manager_id: int = Column(Integer, index=True, nullable=False)

    sales: Mapped[list["Sale"]] = relationship(back_populates="pharmacy")
    inventories: Mapped[list["Inventory"]] = relationship(back_populates="pharmacy")
    employees: Mapped[list["PharmacyEmployee"]] = relationship(back_populates="pharmacy")

    def is_known_employee(self, employee_id) -> bool:
        return any([e.employee_id for e in self.employees if e.employee_id == employee_id])


class Sale(BaseEntity):
    __tablename__ = 'sale'

    id: int = Column(Integer, primary_key=True)
    total_amount: Decimal = Column(Numeric(5, 2), nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.now, nullable=False)
    employee_id: int = Column(Integer, ForeignKey("pharmacy_employee.id"), nullable=False)

    pharmacy_id: int = Column(Integer, ForeignKey("pharmacy.id"), index=True)
    pharmacy: Mapped[Pharmacy] = relationship(back_populates="sales")

    sale_items: Mapped[list["SaleItem"]] = relationship(back_populates="sale")


class SaleItem(BaseEntity):
    __tablename__ = 'sale_item'

    id: int = Column(Integer, primary_key=True)
    medication_id: int = Column(Integer, nullable=False)
    quantity: int = Column(Integer, CheckConstraint("quantity > 0"))
    unit_price: int = Column(Integer, CheckConstraint("unit_price > 0"))

    sale_id: int = Column(Integer, ForeignKey("sale.id"), nullable=False, index=True)
    sale: Mapped[Sale] = relationship(back_populates="sale_items")


class Inventory(BaseEntity):
    __tablename__ = "inventory"

    id: int = Column(Integer, primary_key=True)
    quantity: int = Column(Integer, CheckConstraint("quantity >= 0"))
    expiration_date: datetime = Column(DateTime, CheckConstraint("expiration_date > CURRENT_TIMESTAMP"), index=True)
    medication_id: int = Column(Integer, nullable=False, index=True)

    pharmacy_id: int = Column(Integer, ForeignKey("pharmacy.id"), index=True)
    pharmacy: Mapped[Pharmacy] = relationship(back_populates="inventories")


class PharmacyEmployee(BaseEntity):
    __tablename__ = "pharmacy_employee"

    id: int = Column(Integer, primary_key=True)
    employee_id: int = Column(Integer, nullable=False, index=True)

    pharmacy_id: int = Column(Integer, ForeignKey("pharmacy.id"), index=True)
    pharmacy: Mapped[Pharmacy] = relationship(back_populates="employees")
