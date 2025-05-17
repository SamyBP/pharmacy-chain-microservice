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

    return {
        "invite_token": invite_token,
        "verification_link": verification_link
    }


@user_router.post("/invite/callback")
def complete_registration(payload: CompleteRegistrationRequest):
    try:
        invite_token_claims = Jwt.decode(payload.invite_token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Invite token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid invite token")

    hashed_pw = bcrypt.hashpw(payload.password.encode(), salt=bcrypt.gensalt()).decode()

    return {
        "invite_token_claims": invite_token_claims,
        "hashed_pw": hashed_pw,
        "phone_number": payload.phone_number
    }
