from typing import Any


class IsUserOfTypeManager:

    def __call__(self, claims: dict[str, Any]):
        role = claims.get('role', None)

        if not role or role != 'MANAGER':
            return False

        return True


