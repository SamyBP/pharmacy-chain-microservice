from typing import Any


class IsUserAuthenticated:

    def __call__(self, claims: dict[str, Any]):
        user_role = claims.get('role', None)

        if user_role is None or not isinstance(user_role, str):
            return False

        role_to_check = getattr(self, 'role', None)

        return True if role_to_check is None else user_role == role_to_check


class IsUserOfTypeEmployee(IsUserAuthenticated):
    role = 'EMPLOYEE'


class IsUserOfTypeManager(IsUserAuthenticated):
    role = 'MANAGER'


if __name__ == '__main__':
    print(IsUserOfTypeEmployee()({'role': 'EMPLOYEE'}))
    print(IsUserOfTypeEmployee()({'role': 'MANAGER'}))
    print(IsUserOfTypeManager()({'role': 'MANAGER'}))
    print(IsUserOfTypeManager()({'role': 'EMPLOYEE'}))
