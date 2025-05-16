from fastapi import APIRouter, Depends

from src.domain.dtos.medication import MedicationOut, MedicationIn
from src.services import MedicationService

medication_router = APIRouter()


@medication_router.get("/", response_model=list[MedicationOut])
def get_medications(_ctrl: MedicationService = Depends(MedicationService)):
    return _ctrl.get_all_medications()


@medication_router.post("/", response_model=MedicationOut)
def create_medication(payload: MedicationIn, _ctrl: MedicationService = Depends(MedicationService)):
    return _ctrl.create_medication(payload)
