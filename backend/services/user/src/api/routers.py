import logging
from typing import Optional

from fastapi import APIRouter, Depends, Request
from jwt_guard.core.jwt import Jwt
from jwt_guard.security.auth_bearer import JWTBearer

from src.api.security import IsUserOfTypeAdmin
from src.domain.dtos.invite_user import (
    InviteUserRequest,
    CompleteRegistrationRequest,
    InviteUserSuccessResponse,
)
from src.domain.dtos.user import UserOut, UpdateUserRequest, UserProfileDto
from src.service.notification import NotificationAction
from src.service.user_service import UserService
from src.settings import INVITE_VERIFICATION_CALLBACK_URL

user_router = APIRouter(prefix="/api/users", tags=["user-management"])

logger = logging.getLogger("uvicorn.error")


@user_router.post(
    "/invite",
    response_model=InviteUserSuccessResponse,
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin()))],
)
async def invite_user(
    payload: InviteUserRequest, _ctrl: UserService = Depends(UserService)
):
    invite_token = Jwt.encode(payload.model_dump())

    verification_link = (
        f"{INVITE_VERIFICATION_CALLBACK_URL}/complete-account?token={invite_token}"
    )

    logger.info(verification_link)

    await _ctrl.send_invite_email(to=payload.email, verification_link=verification_link)
    return InviteUserSuccessResponse.from_email(email=payload.email)


@user_router.post("/invite/complete")
def complete_registration(
    payload: CompleteRegistrationRequest, _ctrl: UserService = Depends(UserService)
):
    _ctrl.register_user(payload)
    return {"message": "Your account has been created!"}


@user_router.get(
    "/",
    response_model=list[UserOut],
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin()))],
)
def retrieve_users(
    role: Optional[str] = None, _ctrl: UserService = Depends(UserService)
):
    return _ctrl.get_users_by_optional_filter(_filter=role)


@user_router.delete(
    "/{id}",
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin()))],
    status_code=204,
)
async def delete_user_account(id: int, _ctrl: UserService = Depends(UserService)):
    deleted_user = _ctrl.delete_user_by_id(id)
    await _ctrl.notify_user(
        user=deleted_user, action=NotificationAction.ACCOUNT_DELETED
    )


@user_router.patch(
    "/{id}",
    dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin()))],
    response_model=UserOut,
)
async def update_user(
    id: int, payload: UpdateUserRequest, _ctrl: UserService = Depends(UserService)
):
    updated_user = _ctrl.update_user_by_id(id, payload)
    await _ctrl.notify_user(
        user=updated_user, action=NotificationAction.ACCOUNT_UPDATED
    )
    return updated_user


@user_router.get(
    "/profile", dependencies=[Depends(JWTBearer())], response_model=UserProfileDto
)
def get_authenticated_user_profile(
    request: Request, _ctrl: UserService = Depends(UserService)
):
    user_id = request.state.auth.id
    role = request.state.auth.role
    return _ctrl.get_user_profile_by_id(user_id, role)
