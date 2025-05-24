from typing import Optional

from fastapi import Depends, HTTPException

from fastdbx.transactions.meta import transactional
from src.domain.dtos.medication import (
    MedicationDto,
    CreateMedicationRequest,
    MedicationImageDto,
    MedicationManufacturerDto,
    UpdateMedicationRequest,
)
from src.domain.internal.abstracts import AbstractMedicationRepository
from src.domain.models import Medication, MedicationImage
from src.domain.validations.exceptions import MedicationNotFoundException
from src.repository import MedicationRepository


class MedicationService:
    def __init__(
        self,
        medication_repo: AbstractMedicationRepository = Depends(MedicationRepository),
    ):
        self.medication_repo = medication_repo

    def __call__(self, *args, **kwargs):
        return MedicationService()

    @transactional()
    def get_medications(self, ids: Optional[list[int]]) -> list[MedicationDto]:
        if ids:
            medications = self.medication_repo.find_by_ids(ids)
        else:
            medications = self.medication_repo.find_all()

        return [MedicationDto.model_validate(m) for m in medications]

    @transactional()
    def create_medication(
        self, payload: CreateMedicationRequest, image_paths: list[str]
    ) -> MedicationDto:
        medication = self.medication_repo.save(
            instance=Medication(**payload.model_dump())
        )

        images: list[MedicationImageDto] = []

        for path in image_paths:
            image_url, alt_text = path, path.split("/")[-1]
            medication_image = self.medication_repo.save_image(
                image=MedicationImage(
                    image_url=image_url, alt_text=alt_text, medication_id=medication.id
                )
            )
            images.append(MedicationImageDto.model_validate(medication_image))

        return MedicationDto(
            id=medication.id,
            name=medication.name,
            description=medication.description,
            manufacturer=MedicationManufacturerDto.model_validate(
                medication.manufacturer
            ),
            images=images,
        )

    @transactional()
    def update_medication(
        self, medication_id: int, payload: UpdateMedicationRequest
    ):
        medication = self.medication_repo.find_by_id(medication_id)

        if medication is None:
            raise MedicationNotFoundException(medication_id)

        attrs_to_update = {}

        if payload.name:
            attrs_to_update["name"] = payload.name

        if payload.description:
            attrs_to_update["description"] = payload.description

        if payload.purchase_price:
            attrs_to_update["purchase_price"] = payload.purchase_price

        if not attrs_to_update:
            raise HTTPException(
                status_code=400,
                detail=f"At least one attribute must be set in order to update medication {medication_id}",
            )

        self.medication_repo.save(medication, **attrs_to_update)
