from typing import Annotated

from pydantic import BaseModel, AfterValidator
from src.domain.validations.sale_validations import is_valid_quantity, is_valid_unit_price


class SaleItemDto(BaseModel):
    medication_id: int
    quantity: Annotated[int, AfterValidator(is_valid_quantity)]
    unit_price: Annotated[int, AfterValidator(is_valid_unit_price)]


class MedicationSaleRequest(BaseModel):
    sale_items: list[SaleItemDto]
