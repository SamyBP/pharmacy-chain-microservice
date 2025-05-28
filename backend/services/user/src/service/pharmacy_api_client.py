import random

import httpx

from src.domain.internal.pharmacy_client import PharmacyClient
from src.domain.models import Role
from src.settings import PHARMACY_SERVICE_BASE_API_URL, PHARMACY_SERVICE_API_KEY


class PharmacyApiClient(PharmacyClient):

    def __init__(self):
        self.client = httpx.Client(base_url=PHARMACY_SERVICE_BASE_API_URL)
        self.api_key = PHARMACY_SERVICE_API_KEY

    def __call__(self, *args, **kwargs):
        return PharmacyApiClient()

    def get_pharmacies_by_user_and_role(self, user_id: int, role: Role) -> list[int]:
        query_params = {"user_id": user_id, "role": role, "key": self.api_key}
        response = self.client.get("/internal/", params=query_params)
        response.raise_for_status()
        return response.json()['ids']

    def set_user_at_pharmacy(self, user_id: int, pharmacy_id, role: Role):
        body = {
            "user_id": user_id,
            "pharmacy_id": pharmacy_id,
            "role": role
        }

        response = self.client.put("/internal/employees/sync", json=body)
        response.raise_for_status()


class MockPharmacyApiClient(PharmacyClient):

    def get_pharmacies_by_user_and_role(self, user_id: int, role: Role) -> list[int]:
        random_size = random.randint(1, 4)
        return [i for i in range(random_size)]

    def set_user_at_pharmacy(self, user_id: int, pharmacy_id, role: Role):
        pass
