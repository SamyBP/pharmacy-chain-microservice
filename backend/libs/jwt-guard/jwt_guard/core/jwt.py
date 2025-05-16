from typing import Any

import jwt
from jwt_guard.config import config
from jwt_guard.core.exceptions import InvalidTokenException


class Jwt:

    @staticmethod
    def encode(payload: dict[str, Any]) -> str:
        return jwt.encode(payload, key=config.jwt.secret_key, algorithm=config.jwt.algorithm)

    @staticmethod
    def decode(token: str) -> dict:
        try:
            payload = jwt.decode(token, key=config.jwt.secret_key, algorithms=[config.jwt.algorithm])

            if not payload:
                raise InvalidTokenException("Could not decode payload")

            return payload
        except jwt.PyJWTError as e:
            raise InvalidTokenException(str(e))
