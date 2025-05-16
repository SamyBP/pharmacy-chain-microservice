from fastapi import Depends
from sqlmodel import Session

from db import Database
from repository.pharmacy_repository import PharmacyRepository
from services.pharmacy_service import PharmacyService


def get_pharmacy_repo(session: Session = Depends(Database.session)) -> PharmacyRepository:
    return PharmacyRepository(session)


def get_pharmacy_service(pharmacy_repo: PharmacyRepository = Depends(get_pharmacy_repo)) -> PharmacyService:
    return PharmacyService(pharmacy_repo)
