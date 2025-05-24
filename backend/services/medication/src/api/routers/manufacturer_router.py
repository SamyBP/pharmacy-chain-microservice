from fastapi import APIRouter, Depends

from src.domain.dtos.manufacturer import ManufacturerDto
from src.services.manufacturer_service import ManufacturerService

manufacturer_router = APIRouter()


@manufacturer_router.get("/", response_model=list[ManufacturerDto])
def get_all_manufacturers(_ctrl: ManufacturerService = Depends(ManufacturerService)):
    return _ctrl.get_all_manufacturers()
