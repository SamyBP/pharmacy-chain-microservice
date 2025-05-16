from datetime import datetime

from pydantic import BaseModel


class TokenIn(BaseModel):
    principal: str
    password: str


class TokenOut(BaseModel):
    token: str
    expires_at: int

    @staticmethod
    def new(token: str, expires_at: datetime) -> "TokenOut":
        return TokenOut(
            token=token, expires_at=int(expires_at.timestamp())
        )
