from fastapi import APIRouter, Depends, Request
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security.permissions import IsUserOfTypeEmployee
from src.domain.dtos.inventory import UpdateInventoryRequest
from src.domain.dtos.medication import MedicationDto
from src.domain.dtos.sale import MedicationSaleRequest
from src.service.pharmacy_service import PharmacyService

pharmacy_employee_router = APIRouter(
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeEmployee()))],
    tags=["pharmacy-employee-actions"],
)


# TODO retrieve the rampancy_id from request url
@pharmacy_employee_router.get(
    "/{pharmacy_id}/medications", response_model=list[MedicationDto]
)
def get_medications_from_employees_pharmacy(
    request: Request,
    pharmacy_id: int,
    _ctrl: PharmacyService = Depends(PharmacyService),
):
    employee_id = request.state.auth.id
    return _ctrl.get_medications_from_pharmacy(pharmacy_id, employee_id=employee_id)


@pharmacy_employee_router.post("/{pharmacy_id}/sales")
def perform_medication_sale(
    request: Request,
    pharmacy_id: int,
    payload: MedicationSaleRequest,
    _ctrl: PharmacyService = Depends(PharmacyService),
):
    employee_id = request.state.auth.id
    _ctrl.place_sale_at_pharmacy(employee_id, pharmacy_id, items=payload.sale_items)
    return {"message": "Placed sale successfully"}


@pharmacy_employee_router.patch("/{pharmacy_id}/inventory")
def update_inventory(
    request: Request,
    pharmacy_id: int,
    payload: UpdateInventoryRequest,
    _ctrl: PharmacyService = Depends(PharmacyService),
):
    employee_id = request.state.auth.id
    _ctrl.update_pharmacy_inventory(pharmacy_id, employee_id, payload)
    return {"message": f"Updated inventory for pharmacy: {pharmacy_id} successfully"}
