from typing import Annotated, Optional

from pydantic import BaseModel, AfterValidator, Field

from src.domain.dtos.validation import is_phone_number_valid, is_notification_preference_valid


class InviteUserRequest(BaseModel):
    email: str
    role: str


class InviteUserSuccessResponse(BaseModel):
    message: str

    @staticmethod
    def from_email(email: str) -> "InviteUserSuccessResponse":
        return InviteUserSuccessResponse(
            message=f"An email was sent to {email} for setting up the account"
        )


class InviteNotificationDto(BaseModel):
    email: str
    verification_link: str


class CompleteRegistrationRequest(BaseModel):
    invite_token: str
    password: str
    phone_number: Annotated[str, AfterValidator(is_phone_number_valid)]
    notification_preference: Annotated[Optional[str], AfterValidator(is_notification_preference_valid)]
