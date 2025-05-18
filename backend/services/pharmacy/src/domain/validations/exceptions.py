from fastapi import HTTPException


class InsufficientInventoryException(HTTPException):

    def __init__(self, *, detail: str):
        super().__init__(status_code=400, detail=detail)


class UnknownEmployeeException(HTTPException):
    def __init__(self, *, detail: str):
        super().__init__(status_code=401, detail=detail)
