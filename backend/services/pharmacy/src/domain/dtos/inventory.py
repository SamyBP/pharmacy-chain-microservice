from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, AfterValidator, Field

from src.domain.validations.common import is_future_date, is_positive_number


class UpdateInventoryRequest(BaseModel):
    medication_id: int
    quantity: Annotated[Optional[int], AfterValidator(is_positive_number)] = Field(
        default=None
    )
    expiration_date: Annotated[Optional[datetime], AfterValidator(is_future_date)] = (
        Field(default=None)
    )


class RegisterInventoryRequest(BaseModel):
    medication_id: int
    quantity: Annotated[Optional[int], AfterValidator(is_positive_number)]
    expiration_date: Annotated[Optional[datetime], AfterValidator(is_future_date)]
