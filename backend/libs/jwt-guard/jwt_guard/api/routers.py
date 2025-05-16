from fastapi import APIRouter, Depends, Request

from jwt_guard.api.schemas import TokenIn
from jwt_guard.config import config
from jwt_guard.security.auth_bearer import JWTBearer
from jwt_guard.services.jwt_service import JwtService

jwt_guard_router = APIRouter(tags=config.open_api.tags, prefix="/token")


@jwt_guard_router.post("/")
def obtain_token(payload: TokenIn, _ctrl: JwtService = Depends(JwtService)):
    return _ctrl.obtain_token(payload)


@jwt_guard_router.post("/verify", dependencies=[Depends(JWTBearer())])
def verify_token(request: Request):
    auth = request.state.auth
    return {"expires_at": auth.exp}
