from fastapi import Depends, HTTPException
from fastdbx.transactions.meta import transactional
from sqlalchemy.exc import SQLAlchemyError

from src.domain.dtos.inventory import RegisterInventoryRequest, UpdateInventoryRequest
from src.domain.internal.abstracts import AbstractInventoryRepository
from src.domain.models import Inventory
from src.domain.validations.exceptions import UnknownEmployeeException
from src.repository.inventory_repo import InventoryRepository


class InventoryService:

    def __init__(
        self, inventory_repo: AbstractInventoryRepository = Depends(InventoryRepository)
    ):
        self.inventory_repo = inventory_repo

    def __call__(self, *args, **kwargs):
        return InventoryService()

    @transactional()
    def register_medication_in_pharmacy_inventory(
        self, pharmacy_id: int, payload: RegisterInventoryRequest
    ):
        _inventory = self.inventory_repo.find_by_pharmacy_and_medication(
            pharmacy_id, medication_id=payload.medication_id
        )

        if _inventory:
            self.inventory_repo.save(_inventory, **payload.model_dump())
            return

        _new_inventory = Inventory(pharmacy_id=pharmacy_id, **payload.model_dump())
        self.inventory_repo.save(_new_inventory)

    @transactional(rollback_for=(UnknownEmployeeException, SQLAlchemyError))
    def update_pharmacy_inventory(
        self, pharmacy_id, employee_id, payload: UpdateInventoryRequest
    ):
        inventory = self.inventory_repo.find_by_pharmacy_and_medication(
            pharmacy_id, medication_id=payload.medication_id
        )

        if inventory is None:
            raise HTTPException(
                status_code=404,
                detail=f"No inventory for {payload.medication_id} at {pharmacy_id}",
            )

        if not inventory.pharmacy.is_known_employee(employee_id):
            raise UnknownEmployeeException(
                detail=f"Employee {employee_id} is can not perform inventory updates at pharmacy {pharmacy_id}"
            )

        attrs_to_update = {}

        if payload.quantity is not None:
            attrs_to_update["quantity"] = payload.quantity

        if payload.expiration_date is not None:
            attrs_to_update["expiration_date"] = payload.expiration_date

        if not attrs_to_update:
            raise HTTPException(
                status_code=400,
                detail="At least one of 'quantity' or 'expiration_date' must be provided.",
            )

        self.inventory_repo.save(inventory, **attrs_to_update)
