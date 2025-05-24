from decimal import Decimal

from fastapi import UploadFile


def is_positive_decimal(value: Decimal) -> Decimal:
    if value and value < 0.0:
        raise ValueError("should be a positive number")

    return value


def is_uploaded_files_count_allowed(value: list[UploadFile]) -> list[UploadFile]:
    if len(value) > 3:
        raise ValueError("can't upload more than three files")

    return value
