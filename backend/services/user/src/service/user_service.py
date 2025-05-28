from typing import Optional

import bcrypt
import jwt
from fastapi import HTTPException, Depends
from fastdbx.transactions.meta import transactional
from jwt_guard.core.jwt import Jwt

from src.domain.dtos.invite_user import CompleteRegistrationRequest
from src.domain.dtos.user import UserOut, UpdateUserRequest, UserProfileDto
from src.domain.internal.abstracts import AbstractUserRepository
from src.domain.internal.pharmacy_client import PharmacyClient
from src.domain.models import User, Role
from src.repository.user_repo import UserRepository
from src.service.notification import EmailNotification, NotificationAction, Notification
from src.service.pharmacy_api_client import MockPharmacyApiClient, PharmacyApiClient


class UserService:

    def __init__(
        self,
        user_repo: AbstractUserRepository = Depends(UserRepository),
        pharmacy_client: PharmacyClient = Depends(PharmacyApiClient),
    ):
        self.user_repo = user_repo
        self.pharmacy_client = pharmacy_client

    def __call__(self, *args, **kwargs):
        return UserService()

    async def send_invite_email(self, to: str, verification_link: str):
        notification = EmailNotification(template_name="email/register-invitation.html")
        email_body = {"email": to, "verification_url": verification_link}
        await notification.send(to, email_body)

    async def notify_user(self, user: UserOut, action: NotificationAction):
        message = NotificationAction.get_message_from_action(action)
        notification_strategy, to = Notification.create_for_user(user)

        if notification_strategy is None:
            return

        await notification_strategy.send(to, message)

    @transactional()
    def get_users_by_optional_filter(self, _filter: Optional[str]) -> list[UserOut]:
        if _filter is not None and not Role.is_valid(_filter):
            raise HTTPException(
                status_code=400,
                detail=f"Given filter is not valid, valid ones are {Role.values()}",
            )
        elif _filter is not None:
            users = self.user_repo.find_by_role(role=_filter)
        else:
            users = self.user_repo.find_all()

        return [UserOut.model_validate(u) for u in users]

    @transactional()
    def delete_user_by_id(self, id: int) -> UserOut:
        user_to_delete = self.user_repo.find_by_id(id)

        if user_to_delete is None:
            raise HTTPException(
                status_code=400, detail=f"No user with id: {id} was found"
            )

        is_deleted = self.user_repo.delete_by_id(id)
        assert is_deleted

        return UserOut.model_validate(user_to_delete)

    @transactional()
    def update_user_by_id(self, id: int, payload: UpdateUserRequest) -> UserOut:
        user_to_update = self.user_repo.find_by_id(id)

        if user_to_update is None:
            raise HTTPException(
                status_code=400, detail=f"No user with id: {id} was found"
            )

        attrs_to_update = dict()

        if payload.phone_number is not None:
            attrs_to_update["phone_number"] = payload.phone_number

        if payload.name is not None:
            attrs_to_update["name"] = payload.name

        updated_user = self.user_repo.save(user_to_update, **attrs_to_update)
        return UserOut.model_validate(updated_user)

    @transactional()
    def register_user(self, payload: CompleteRegistrationRequest) -> UserOut:
        try:
            invite_token_claims = Jwt.decode(payload.invite_token)
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Invite expired")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid invitation")

        hashed_pw = self._hashpw(plain=payload.password)

        saved_user = self.user_repo.save(
            User(
                password=hashed_pw,
                phone_number=payload.phone_number,
                notification_preference=payload.notification_preference,
                name=payload.name,
                email=invite_token_claims.get("email"),
                role=invite_token_claims.get("role")
            )
        )

        self.pharmacy_client.set_user_at_pharmacy(
            user_id=saved_user.id,
            pharmacy_id=invite_token_claims.get("pharmacy_id"),
            role=invite_token_claims.get("role")
        )

        return UserOut.model_validate(saved_user)

    def _hashpw(self, plain: str) -> str:
        salt = bcrypt.gensalt()
        hashed_bytes = bcrypt.hashpw(plain.encode(), salt)
        return hashed_bytes.decode()

    @transactional()
    def get_user_profile_by_id(self, user_id: int, role: Role) -> UserProfileDto:
        user = self.user_repo.find_by_id(user_id)
        assert user is not None, "The user should exits, 401 returned by auth lib"

        affiliated_pharmacies = self.pharmacy_client.get_pharmacies_by_user_and_role(user_id, role)

        return UserProfileDto(
            info=UserOut.model_validate(user),
            pharmacies=affiliated_pharmacies
        )
