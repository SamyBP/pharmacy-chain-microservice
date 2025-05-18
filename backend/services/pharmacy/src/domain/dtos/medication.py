import logging
from typing import Any

from pydantic import BaseModel


class MedicationManufacturerDto(BaseModel):
    id: int
    name: str


class MedicationImageDto(BaseModel):
    id: int
    image_url: str
    alt_text: str

logger = logging.getLogger("uvicorn.error")


class MedicationDto(BaseModel):
    id: int
    name: str
    description: str
    manufacturer: MedicationManufacturerDto
    images: list[MedicationImageDto]

    @staticmethod
    def from_json(json: dict[str, Any]) -> "MedicationDto":
        logger.info(json)
        return MedicationDto(
            id=json.get("id"),
            name=json.get("name"),
            description=json.get("description"),  # <-- fixed typo here
            manufacturer=MedicationManufacturerDto(**json.get('manufacturer')),
            images=[MedicationImageDto(**im) for im in json.get('images')]
        )
