from fastdbx.core.repo import CrudRepository
from src.domain.internal.abstracts import AbstractManufacturerRepository
from src.domain.models import Manufacturer


class ManufacturerRepository(AbstractManufacturerRepository, CrudRepository):

    def __init__(self):
        super().__init__(Manufacturer)

    def __call__(self, *args, **kwargs):
        return ManufacturerRepository()
