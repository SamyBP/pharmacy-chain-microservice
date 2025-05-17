import re

from src.domain.models import Role, NotificationPreference


def is_phone_number_valid(value: str) -> str:
    if value is not None and not re.fullmatch(r"\+4\d{10}", value):
        raise ValueError(
            "Phone number must start with '+4' adn be followed by 10 digits"
        )
    return value


def is_role_valid(value: str) -> str:
    if value is not None and not Role.is_valid(value):
        raise ValueError(f"Role must be one of: {', '.join(Role.values())}")
    return value


def is_notification_preference_valid(value: str) -> str:
    if value is not None and not NotificationPreference.is_valid(value):
        raise ValueError(
            f"Notification preference must be one of: {', '.join(NotificationPreference.values())} "
        )
    return value

