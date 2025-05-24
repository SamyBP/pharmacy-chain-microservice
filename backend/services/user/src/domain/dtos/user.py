from typing import Optional, Annotated

from pydantic import BaseModel, ConfigDict, AfterValidator, Field

from src.domain.dtos.validation import (
    is_phone_number_valid,
    is_role_valid,
    is_notification_preference_valid,
)


class UserOut(BaseModel):
    id: int
    email: str
    phone_number: str
    role: str
    notification_preference: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class UpdateUserRequest(BaseModel):
    phone_number: Annotated[Optional[str], AfterValidator(is_phone_number_valid)] = (
        Field(default=None)
    )
    role: Annotated[Optional[str], AfterValidator(is_role_valid)] = Field(default=None)
    notification_preference: Annotated[
        Optional[str], AfterValidator(is_notification_preference_valid)
    ] = Field(default=None)


class UserProfileDto(BaseModel):
    info: UserOut
    pharmacies: list[int]
