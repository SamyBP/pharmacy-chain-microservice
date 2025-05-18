def is_positive_integer(value: int) -> int:
    if value <= 0:
        raise ValueError(f"value should a positive integer")
    return value
