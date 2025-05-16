from datetime import datetime
from typing import Any

from fastapi import Depends
from fastdbx.transactions.meta import transactional

from jwt_guard.api.schemas import TokenIn, TokenOut
from jwt_guard.config import config
from jwt_guard.core.exceptions import JwtGuardException
from jwt_guard.core.jwt import Jwt
from jwt_guard.core.password import get_authmodel_pw_attr, check_hashpw_matches_plain
from jwt_guard.repo.auth_model_repo import AuthModelRepository


class JwtService:

    def __init__(self, repo: AuthModelRepository = Depends(AuthModelRepository)):
        self._repo = repo

    def __call__(self, *args, **kwargs):
        return JwtService()

    @transactional()
    def obtain_token(self, payload: TokenIn) -> TokenOut:
        authmodel = self._repo.find_by_principal(payload.principal)

        if authmodel is None:
            raise JwtGuardException("Invalid principal name")

        password = get_authmodel_pw_attr(authmodel, config.model.password_field)
        check_hashpw_matches_plain(plain_pw=payload.password, hashpw=password)

        expires_at = datetime.now() + config.jwt.token_lifetime
        token_claims = self._obtain_claims_for_token(authmodel, expiration=expires_at)
        token = Jwt.encode(payload=token_claims)

        return TokenOut.new(token, expires_at)

    def _obtain_claims_for_token(self, authmodel, expiration) -> dict[str, Any]:
        claims = {c: getattr(authmodel, c, None) for c in config.jwt.claims}
        claims.update({'exp': expiration})
        return claims
