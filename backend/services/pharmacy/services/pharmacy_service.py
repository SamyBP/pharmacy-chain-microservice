from models import Pharmacy
from repository.pharmacy_repository import PharmacyRepository


class PharmacyService:

    def __init__(self, pharmacy_repo: PharmacyRepository):
        self.pharmacy_repo = pharmacy_repo

    def get_all_pharmacies(self) -> list[Pharmacy]:
        return self.pharmacy_repo.find_all()
