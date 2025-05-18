from datetime import datetime


def is_positive_integer(value: int) -> int:
    if value is not None and value <= 0:
        raise ValueError(f"value should a positive integer")
    return value


def is_future_date(value: datetime) -> datetime:
    if value is not None and value <= datetime.now():
        raise ValueError("Date must be in the future.")
    return value
