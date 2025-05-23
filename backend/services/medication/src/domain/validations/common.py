from decimal import Decimal


def is_positive_decimal(value: Decimal) -> Decimal:
    if value and value < 0.0:
        raise ValueError("should be a positive number")

    return value
