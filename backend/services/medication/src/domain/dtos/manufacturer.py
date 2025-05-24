from pydantic import BaseModel, ConfigDict


class ManufacturerDto(BaseModel):
    id: int
    name: str
    contact_info: str

    model_config = ConfigDict(from_attributes=True)