from src.domain.validations.common import is_positive_integer


def is_valid_quantity(value: int) -> int:
    return is_positive_integer(value)


def is_valid_unit_price(value: int) -> int:
    return is_positive_integer(value)
