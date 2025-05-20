from typing import Optional

from fastapi import Request, APIRouter, Depends
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security.permissions import IsUserOfTypeManager
from src.domain.dtos.inventory import RegisterInventoryRequest
from src.domain.dtos.sale import MostSoldMedicationDto, SaleTrendDto
from src.service.inventory_service import InventoryService
from src.service.sale_service import SaleService

pharmacy_manager_router = APIRouter(
    tags=["pharmacy-manager-actions"],
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeManager()))],
)


@pharmacy_manager_router.post("/{pharmacy_id}/inventory")
def register_medication_to_inventory(
    pharmacy_id: int,
    payload: RegisterInventoryRequest,
    _ctrl: InventoryService = Depends(InventoryService),
):
    _ctrl.register_medication_in_pharmacy_inventory(pharmacy_id, payload)
    return {"message": "Successfully register inventory"}


@pharmacy_manager_router.get("/sales", response_model=list[MostSoldMedicationDto])
def retrieve_most_sold_medications(
    request: Request,
    most_sold: Optional[int] = 3,
    _ctrl: SaleService = Depends(SaleService),
):
    manager_id = request.state.auth.id
    return _ctrl.get_most_sold_medications(manager_id, limit=most_sold)


@pharmacy_manager_router.get("/sales/trends", response_model=list[SaleTrendDto])
def retrieve_sale_trends_from_managed_pharmacies_in_past_days(
    request: Request, days: Optional[int] = 7, _ctrl: SaleService = Depends(SaleService)
):
    manager_id = request.state.auth.id
    return _ctrl.get_sale_trends_past_days(manager_id, days)
