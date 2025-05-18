from fastapi import APIRouter, Depends
from src.domain.dtos.medication import MedicationDto
from src.domain.dtos.pharmacy import PharmacyDto
from src.service.pharamcy_service import PharmacyService

pharmacy_router = APIRouter()


@pharmacy_router.get("/{medication_id}", response_model=list[PharmacyDto])
def get_pharmacies_containing_medication(medication_id: int, _ctrl: PharmacyService = Depends(PharmacyService)):
    return _ctrl.get_pharmacies_for_medication(medication_id)


@pharmacy_router.get("/medications", response_model=list[MedicationDto])
def get_medications_from_chain(_ctrl: PharmacyService = Depends(PharmacyService)):
    return _ctrl.get_not_expired_medications()
