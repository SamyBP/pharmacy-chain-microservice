from typing import Any


class IsUserOfTypeAdmin:

    def __call__(self, claims: dict[str, Any]) -> bool:
        role = claims.get("role", None)
        assert isinstance(role, str)
        return role is not None and role.upper() == 'ADMIN'
