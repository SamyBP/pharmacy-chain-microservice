import bcrypt
from fastapi import Depends
from fastdbx.core import BaseEntity, CrudRepository
from fastdbx.transactions.meta import transactional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Integer, String


class User(BaseEntity):
    __tablename__ = 'user'

    id: int = Column(Integer, primary_key=True)
    email: str = Column(String, unique=True)
    password: str = Column(String)
    role: str = Column(String)


class UserRepository(CrudRepository[User]):

    def __init__(self):
        super().__init__(User)

    def __call__(self, *args, **kwargs):
        return UserRepository()


class UserIn(BaseModel):
    email: str
    password: str
    role: str


class UserOut(BaseModel):
    id: int
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class UserService:

    def __init__(self, repo: UserRepository = Depends(UserRepository)):
        self.repo = repo

    def __call__(self, *args, **kwargs):
        return UserService()

    @transactional()
    def register(self, payload: UserIn) -> UserOut:
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(payload.password.encode(), salt)
        new_user = self.repo.save(instance=User(email=payload.email, password=hashed_pw, role=payload.role))
        return UserOut.model_validate(new_user)

    @transactional()
    def get_users(self) -> list[UserOut]:
        users = self.repo.find_all()
        return [UserOut.model_validate(user) for user in users]
