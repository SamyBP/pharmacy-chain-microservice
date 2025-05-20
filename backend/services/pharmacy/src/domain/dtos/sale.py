from datetime import datetime
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, AfterValidator, ConfigDict

from src.domain.validations.common import is_positive_integer
from src.domain.dtos.medication import MedicationManufacturerDto


class SaleItemDto(BaseModel):
    medication_id: int
    quantity: Annotated[int, AfterValidator(is_positive_integer)]
    unit_price: Annotated[int, AfterValidator(is_positive_integer)]


class MedicationSaleRequest(BaseModel):
    sale_items: list[SaleItemDto]


class MostSoldMedicationDto(BaseModel):
    medication_id: int
    name: str
    quantity: int
    manufacturer: MedicationManufacturerDto


class SaleTrendDto(BaseModel):
    sale_date: datetime
    total_sales_amount: Decimal
    number_of_sales: int

    model_config = ConfigDict(from_attributes=True)
