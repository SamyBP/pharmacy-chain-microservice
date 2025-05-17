from fastdbx.core import CrudRepository
from sqlalchemy import select

from src.domain.models import User


class UserRepository(CrudRepository[User]):

    def __init__(self):
        super().__init__(User)

    def __call__(self, *args, **kwargs):
        return UserRepository()

    def find_by_role(self, role: str) -> list[User]:
        statement = select(self.entity).where(self.entity.role == role)
        return self.session.scalars(statement).all()
