from decimal import Decimal
from typing import Annotated, Optional

from pydantic import BaseModel, ConfigDict, AfterValidator, Field

from src.domain.validations.common import is_positive_decimal


class MedicationManufacturerDto(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class MedicationImageDto(BaseModel):
    id: int
    image_url: str
    alt_text: str

    model_config = ConfigDict(from_attributes=True)


class MedicationDto(BaseModel):
    id: int
    name: str
    description: str
    manufacturer: MedicationManufacturerDto
    images: list[MedicationImageDto]

    model_config = ConfigDict(from_attributes=True)


class CreateMedicationRequest(BaseModel):
    name: str
    description: str
    purchase_price: Annotated[Decimal, AfterValidator(is_positive_decimal)]
    manufacturer_id: int


class UpdateMedicationRequest(BaseModel):
    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    purchase_price: Annotated[Optional[Decimal], AfterValidator(is_positive_decimal)]
