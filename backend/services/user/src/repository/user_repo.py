from fastdbx.core import CrudRepository

from src.domain.models import User


class UserRepository(CrudRepository[User]):

    def __init__(self):
        super().__init__(User)

    def __call__(self, *args, **kwargs):
        return UserRepository()
