from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, AfterValidator, Field

from src.domain.validations.common import is_future_date
from src.domain.validations.sale_validations import is_valid_quantity


class UpdateInventoryRequest(BaseModel):
    medication_id: int
    quantity: Annotated[Optional[int], AfterValidator(is_valid_quantity)] = Field(
        default=None
    )
    expiration_date: Annotated[Optional[datetime], AfterValidator(is_future_date)] = (
        Field(default=None)
    )
