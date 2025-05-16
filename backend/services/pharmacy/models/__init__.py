from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship, CheckConstraint


class Pharmacy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, index=True)
    address: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    manager_id: int = Field(nullable=False)

    sales: list["Sale"] = Relationship(back_populates="pharmacy")
    inventories: list["Inventory"] = Relationship(back_populates="pharmacy")
    employees: list["PharmacyEmployee"] = Relationship(back_populates="pharmacy")


class Sale(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    total_amount: Decimal = Field(max_digits=5, decimal_places=2)
    created_at: datetime = Field(default_factory=datetime.now)
    employee_id: int = Field(nullable=False)

    pharmacy_id: Optional[int] = Field(default=None, foreign_key="pharmacy.id", index=True)
    pharmacy: Optional[Pharmacy] = Relationship(back_populates="sales")

    sale_items: list["SaleItem"] = Relationship(back_populates="sale")


class SaleItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    medication_id: int = Field(nullable=False)
    quantity: int = Field(sa_column_args=CheckConstraint("quantity>0"))
    unit_price: int = Field(sa_column_args=CheckConstraint("unit_price>0"))

    sale_id: int = Field(foreign_key="sale.id", index=True)
    sale: Optional[Sale] = Relationship(back_populates="sale_items")


class Inventory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    quantity: int = Field(sa_column_args=(CheckConstraint("quantity > 0"),))
    expiration_date: datetime = Field(sa_column_args=(CheckConstraint("expiration_date > CURRENT_TIMESTAMP")))
    medication_id: int = Field(nullable=False)

    pharmacy_id: int = Field(foreign_key="pharmacy.id", index=True)
    pharmacy: Optional[Pharmacy] = Relationship(back_populates="inventories")


class PharmacyEmployee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    employee_id: int = Field(nullable=False)

    pharmacy_id: int = Field(foreign_key="pharmacy.id", index=True)
    pharmacy: Optional[Pharmacy] = Relationship(back_populates="employees")
