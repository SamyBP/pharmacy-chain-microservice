import logging
from typing import Optional, Annotated

from fastapi import APIRouter, Depends, UploadFile, File, Query
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security.permissions import IsUserOfTypeManager
from src.domain.dtos.medication import (
    MedicationDto,
    CreateMedicationRequest,
    parse_json_payload,
    UpdateMedicationRequest,
)
from src.services import MedicationService
from src.services.file_manager import FileManager

medication_router = APIRouter()

logger = logging.getLogger("uvicorn.error")


@medication_router.get("/", response_model=list[MedicationDto])
def get_medications(
    ids: Optional[list[int]] = Query(default=None),
    _ctrl: MedicationService = Depends(MedicationService),
):
    logger.info(f"ids: {ids}")
    return _ctrl.get_medications(ids)


@medication_router.post(
    "/",
    response_model=MedicationDto,
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeManager()))],
    summary="Create medication with images",
    description="""
    `payload` is a JSON string with this structure:
    
    ```json
    {
      "name": str,
      "description": str,
      "purchase_price": float,
      "manufacturer_id": int
    }
    ```
    
    Upload at least 1 image and up to 3 images, using the 'images' form field
    """,
)
def create_medication(
    images: Annotated[list[UploadFile], File(...)],
    payload: CreateMedicationRequest = Depends(
        parse_json_payload(CreateMedicationRequest)
    ),
    medication_service: MedicationService = Depends(MedicationService),
    file_manager: FileManager = Depends(FileManager),
):
    if len(images) > 3:
        raise ValueError("Maximum number of images to upload is 3")

    filenames = []
    for image in images:
        file_manager.validate(image)
        filenames.append(file_manager.save(image))

    try:
        return medication_service.create_medication(payload, filenames)
    except Exception:
        for filename in filenames:
            file_manager.remove(filename)
        raise


@medication_router.patch(
    "/{medication_id}",
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeManager()))],
)
def update_medication_schema(
    medication_id: int,
    payload: UpdateMedicationRequest,
    _ctrl: MedicationService = Depends(MedicationService),
):
    _ctrl.update_medication(medication_id, payload)
    return {"message": f"Updated medication: {medication_id}"}
