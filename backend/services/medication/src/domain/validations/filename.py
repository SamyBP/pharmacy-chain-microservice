from abc import abstractmethod

from src.domain.validations.exceptions import InvalidFilenameException
from src.settings import (
    VALID_FILE_EXTENSIONS,
    MAX_FILENAME_LENGTH,
    FILENAME_FORBIDDEN_CHARACTERS,
)


class FilenameValidator:

    @abstractmethod
    def is_valid(self, filename: str) -> bool:
        pass

    @staticmethod
    def get_validators() -> tuple["FilenameValidator", ...]:
        return FileExtensionValidator(), FilenameCharactersValidator()


class FileExtensionValidator(FilenameValidator):
    _valid_extensions = VALID_FILE_EXTENSIONS

    def is_valid(self, filename: str) -> bool:
        ext = filename.split(".")[-1]

        if ext not in self._valid_extensions:
            raise InvalidFilenameException(
                detail=f"File extension must be one of: {self._valid_extensions}, received: {ext}"
            )

        return True


class FilenameCharactersValidator(FilenameValidator):
    _max_filename_length = MAX_FILENAME_LENGTH
    _forbidden_chars = FILENAME_FORBIDDEN_CHARACTERS

    def is_valid(self, filename: str) -> bool:
        if len(filename) > self._max_filename_length:
            raise InvalidFilenameException("Filename must not exceed 250 characters")

        if filename.startswith(".") or filename.startswith("_"):
            raise InvalidFilenameException("Filename must not start with '.' or '_'")

        if not all(ord(c) < 128 for c in filename):
            raise InvalidFilenameException(
                "Filename must contain only ASCII characters"
            )

        if any(c in self._forbidden_chars for c in filename):
            raise InvalidFilenameException(
                f"Filename must not contain any of: {self._forbidden_chars}"
            )

        return True
