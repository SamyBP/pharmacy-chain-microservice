from fastapi import APIRouter, HTTPException, Depends

from src.domain.dtos.employee import SyncEmployeeToPharmacyDto
from src.service.pharmacy_service import PharmacyService
from src.settings import ALLOWED_INTERNAL_API_KEYS

pharmacy_internal_router = APIRouter()


@pharmacy_internal_router.get("/")
def get_pharmacies_by_user_and_role(
    user_id: int, role: str, key: str, _ctrl: PharmacyService = Depends(PharmacyService)
):
    if key not in ALLOWED_INTERNAL_API_KEYS:
        raise HTTPException(status_code=401, detail="Not authorized. Invalid API key")

    return {"ids": _ctrl.get_pharmacies_by_user_and_role(user_id, role)}


@pharmacy_internal_router.put("/employees/sync", status_code=202)
def sync_pharmacy_with_added_user(
    payload: SyncEmployeeToPharmacyDto,
    _ctrl: PharmacyService = Depends(PharmacyService),
):
    _ctrl.sync_user_to_pharmacy(payload)
