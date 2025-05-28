import random

import httpx

from src.domain.dtos.medication import MedicationDto
from src.domain.internal.medication_client import MedicationClient
from src.settings import MEDICATION_SERVICE_BASE_URL


class MedicationApiClient(MedicationClient):
    def __init__(self):
        self.client = httpx.Client(base_url=MEDICATION_SERVICE_BASE_URL)

    def __call__(self, *args, **kwargs):
        return MedicationApiClient()

    def get_medications_by_ids(self, ids: list[int]) -> list[MedicationDto]:
        if not ids:
            return []
        query_params = [("ids", id) for id in ids]
        response = self.client.get("/medications/", params=query_params)
        response.raise_for_status()
        data = response.json()
        return [MedicationDto.from_json(json) for json in data]


class MockMedicationApiClient(MedicationClient):

    def get_medications_by_ids(self, ids: list[int]) -> list[MedicationDto]:
        def mock_medication_generator(id: int) -> dict:
            return {
                "id": id,
                "name": f"medication_{id}",
                "description": f"description_{id}",
                "manufacturer": {
                    "id": id,
                    "name": f"manufacturer_{id}"
                },
                "images": [
                    {
                        "id": i,
                        "image_url": f"url_{i}",
                        "alt_text": f"alt_{i}"
                    }
                    for i in range(1, random.randint(1, 3) + 1)
                ]
            }

        data = [mock_medication_generator(id) for id in ids]
        return [MedicationDto.from_json(json) for json in data]
