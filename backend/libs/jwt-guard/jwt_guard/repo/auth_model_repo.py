from fastdbx import CrudRepository
from sqlalchemy import select

from jwt_guard.config import config


class AuthModelRepository(CrudRepository):

    def __init__(self):
        super().__init__(entity=config.model.authmodel)

    def __call__(self, *args, **kwargs):
        return AuthModelRepository()

    def find_by_principal(self, principal):
        principal_attr = getattr(self.entity, config.model.username_field, None)

        if principal_attr is None:
            raise AttributeError(f"{config.model.username_field} is not a valid attribute of model {self.entity}")

        statement = select(self.entity).where(principal_attr == principal)
        return self.session.scalars(statement).first()
