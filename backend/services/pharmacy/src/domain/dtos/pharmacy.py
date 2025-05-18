from pydantic import BaseModel, ConfigDict


class PharmacyDto(BaseModel):
    id: int
    name: str
    address: str
    manager_id: int

    model_config = ConfigDict(from_attributes=True)
