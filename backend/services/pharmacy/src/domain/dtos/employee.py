from pydantic import BaseModel


class SyncEmployeeToPharmacyDto(BaseModel):
    user_id: int
    role: str
    pharmacy_id: int
