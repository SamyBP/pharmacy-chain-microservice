from fastapi import HTTPException


class InvalidFilenameException(HTTPException):

    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)


class MedicationNotFoundException(HTTPException):

    def __init__(self, medication_id: int):
        super().__init__(status_code=404, detail=f"Could not find medication: {medication_id}")
