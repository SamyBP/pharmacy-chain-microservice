from fastapi import Depends

from fastdbx import transactional
from src.domain.dtos.manufacturer import ManufacturerDto
from src.domain.internal.abstracts import AbstractManufacturerRepository
from src.repository.manufacturer_repo import ManufacturerRepository


class ManufacturerService:

    def __init__(
        self,
        manufacturer_repo: AbstractManufacturerRepository = Depends(
            ManufacturerRepository
        ),
    ):
        self.manufacturer_repo = manufacturer_repo

    def __call__(self, *args, **kwargs):
        return ManufacturerService()

    @transactional()
    def get_all_manufacturers(self) -> list[ManufacturerDto]:
        manufacturers = self.manufacturer_repo.find_all()
        return [ManufacturerDto.model_validate(m) for m in manufacturers]
