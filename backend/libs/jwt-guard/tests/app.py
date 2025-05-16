import logging.config
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, Request
from fastdbx import Datasource

from jwt_guard.api.routers import jwt_guard_router
from jwt_guard.security.auth_bearer import JWTBearer
from tests.core import UserIn, UserOut, UserService
from tests.settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(jwt_guard_router, prefix="/api/auth")


@app.post("/api/users", response_model=UserOut)
def create_user(payload: UserIn, _ctrl: UserService = Depends(UserService)):
    return _ctrl.register(payload)


def is_user_of_type_normal(claims: dict) -> bool:
    return claims.get("role") == "normal"


def is_user_of_type_admin(claims: dict) -> bool:
    return claims.get("role") == "admin"


@app.get(
    "/api/users", response_model=list[UserOut], dependencies=[Depends(JWTBearer())]
)
def get_users(request: Request, _ctrl: UserService = Depends(UserService)):
    auth = request.state.auth
    logger.info(f"User with id: {auth.id} making GET")
    return _ctrl.get_users()


@app.get(
    "/api/users/admin",
    response_model=list[UserOut],
    dependencies=[Depends(JWTBearer(authorize=is_user_of_type_admin))],
)
def get_users_admin(_ctrl: UserService = Depends(UserService)):
    return _ctrl.get_users()


@app.get(
    "/api/users/normal",
    response_model=list[UserOut],
    dependencies=[Depends(JWTBearer(authorize=is_user_of_type_normal))],
)
def get_users_normal(_ctrl: UserService = Depends(UserService)):
    return _ctrl.get_users()
