import bcrypt
import jwt
from fastapi import HTTPException, Depends
from fastdbx.transactions.meta import transactional
from jwt_guard.core.jwt import Jwt

from src.domain.dtos.invite_user import CompleteRegistrationRequest
from src.domain.dtos.user import UserOut
from src.domain.models import User
from src.repository.user_repo import UserRepository
from src.service.notification import EmailNotification


class UserService:

    def __init__(self, user_repo: UserRepository = Depends(UserRepository)):
        self.user_repo = user_repo

    def __call__(self, *args, **kwargs):
        return UserService()

    async def send_invite_email(self, to: str, verification_link: str):
        notification = EmailNotification(template_name="email/register-invitation.html")
        email_body = {"email": to, "verification_url": verification_link}
        await notification.send(to, email_body)

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
                **invite_token_claims
            )
        )

        return UserOut.model_validate(saved_user)

    def _hashpw(self, plain: str) -> str:
        salt = bcrypt.gensalt()
        hashed_bytes = bcrypt.hashpw(plain.encode(), salt)
        return hashed_bytes.decode()
