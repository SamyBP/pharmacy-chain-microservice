from sqlmodel import Session, select

from models import Pharmacy


class PharmacyRepository:

    def __init__(self, session: Session):
        self.session = session

    def find_all(self) -> list[Pharmacy]:
        statement = select(Pharmacy)
        return self.session.exec(statement).all()
