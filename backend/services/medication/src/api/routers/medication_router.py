from typing import Optional

from fastapi import APIRouter, Depends
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security.permissions import IsUserOfTypeManager
from src.domain.dtos.medication import MedicationDto, CreateMedicationRequest
from src.services import MedicationService

medication_router = APIRouter()


@medication_router.get("/", response_model=list[MedicationDto])
def get_medications(
    ids: Optional[list[int]] = None,
    _ctrl: MedicationService = Depends(MedicationService),
):
    return _ctrl.get_medications(ids)


@medication_router.post(
    "/",
    response_model=MedicationDto,
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeManager))],
)
def create_medication(
    payload: CreateMedicationRequest,
    _ctrl: MedicationService = Depends(MedicationService),
):
    return _ctrl.create_medication(payload)
