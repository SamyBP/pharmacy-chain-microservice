from fastapi import HTTPException


class ImproperlyConfiguredException(Exception):
    pass


class JwtGuardException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=401, detail=detail)


class InvalidTokenException(JwtGuardException):
    pass

