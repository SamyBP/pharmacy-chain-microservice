from datetime import datetime, timezone
from typing import Union


def is_positive_number(value: Union[int, float]) -> Union[int, float]:
    if value is not None and value <= 0:
        raise ValueError(f"value should a positive integer")
    return value


def is_future_date(value: datetime) -> datetime:
    if value is not None and value <= datetime.now(timezone.utc):
        raise ValueError("Date must be in the future.")
    return value
