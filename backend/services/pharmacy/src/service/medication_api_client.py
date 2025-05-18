import httpx

from src.settings import MEDICATION_SERVICE_BASE_URL
from src.domain.dtos.medication import MedicationDto


class MedicationApiClient:
    def __init__(self):
        self.client = httpx.Client(base_url=MEDICATION_SERVICE_BASE_URL)

    def __call__(self, *args, **kwargs):
        return MedicationApiClient()

    def get_medications_by_id(self, ids: list[int], use_mock: bool = False) -> list[MedicationDto]:
        # To be deleted
        if use_mock:
            return self._get_mock_medications_by_id(ids)

        query_params = {"ids": ','.join(map(str, ids))}
        response = self.client.get("/medications", params=query_params)
        response.raise_for_status()
        data = response.json()
        return [MedicationDto.from_json(json) for json in data]

    def _get_mock_medications_by_id(self, ids: list[int]) -> list[MedicationDto]:

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
                        "id": 1,
                        "image_url": "url1",
                        "alt_text": "alt1"
                    },
                    {
                        "id": 2,
                        "image_url": "url1",
                        "alt_text": "alt1"
                    }
                ]
            }

        data = [mock_medication_generator(id) for id in ids]
        return [MedicationDto.from_json(json) for json in data]
