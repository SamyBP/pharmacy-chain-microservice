import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from jwt_guard.core.jwt import Jwt
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security import IsUserOfTypeAdmin
from src.domain.dtos.invite_user import InviteUserRequest, CompleteRegistrationRequest
from src.service.user_service import UserService
from src.settings import INVITE_VERIFICATION_CALLBACK_URL

user_router = APIRouter(prefix="/api/users")


@user_router.post("/invite", dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin()))])
async def invite_user(payload: InviteUserRequest, _ctrl: UserService = Depends(UserService)):
    invite_token = Jwt.encode(payload.model_dump())
    verification_link = f"{INVITE_VERIFICATION_CALLBACK_URL}/complete-account?token={invite_token}"
    await _ctrl.send_invite_email(to=payload.email, verification_link=verification_link)

    return {"message": f"An email was sent to {payload.email} for setting up the account"}


@user_router.post("/invite/complete")
def complete_registration(payload: CompleteRegistrationRequest, _ctrl: UserService = Depends(UserService)):
    return _ctrl.register_user(payload)



