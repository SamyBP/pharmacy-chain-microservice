from types import SimpleNamespace
from typing import Callable

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request

from jwt_guard.core.exceptions import JwtGuardException
from jwt_guard.core.jwt import Jwt


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True, authorize: Callable = lambda _: True):
        super(JWTBearer, self).__init__(auto_error=auto_error)
        self._authorize = authorize

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)

        if not credentials:
            raise JwtGuardException(detail="Invalid authorization code")

        if not credentials.scheme == "Bearer":
            raise JwtGuardException(detail="Invalid authentication scheme. Scheme must be Bearer")

        payload = Jwt.decode(token=credentials.credentials)

        if not self._authorize(payload):
            raise JwtGuardException(detail="Not authorized")

        request.state.auth = SimpleNamespace(**payload)
        return credentials
