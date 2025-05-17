from pydantic import BaseModel


class InviteUserRequest(BaseModel):
    email: str
    role: str


class InviteNotificationDto(BaseModel):
    email: str
    verification_link: str


class CompleteRegistrationRequest(BaseModel):
    invite_token: str
    password: str
    phone_number: str
    notification_preference: str
