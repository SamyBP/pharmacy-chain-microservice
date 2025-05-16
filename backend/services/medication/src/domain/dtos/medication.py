from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class MedicationOut(BaseModel):
    id: int
    name: str
    description: str
    purchase_price: Decimal

    model_config = ConfigDict(from_attributes=True)


class MedicationIn(BaseModel):
    name: str
    description: str
    purchase_price: Decimal
    manufacturer_id: int
