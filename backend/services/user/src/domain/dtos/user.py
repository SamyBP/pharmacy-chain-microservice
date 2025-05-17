from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    id: int
    email: str
    phone_number: str
    role: str
    notification_preference: str

    model_config = ConfigDict(from_attributes=True)
