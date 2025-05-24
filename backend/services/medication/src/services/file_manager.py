import os.path
import uuid

from fastapi import UploadFile

from src.domain.validations.filename import FilenameValidator
from src.settings import FILE_UPLOAD_DIRECTORY


class FileManager:
    def __init__(self):
        self.upload_dir = FILE_UPLOAD_DIRECTORY
        self.validators = FilenameValidator.get_validators()

    def __call__(self, *args, **kwargs):
        return FileManager()

    def validate(self, file: UploadFile):
        for validator in self.validators:
            _ = validator.is_valid(file.filename)

    def save(self, file: UploadFile) -> str:
        ext = file.filename.split(".")[-1]

        uname = f"{uuid.uuid4()}.{ext}"
        path = os.path.join(self.upload_dir, uname)

        os.makedirs(self.upload_dir, exist_ok=True)

        with open(path, "wb") as up_file:
            up_file.write(file.file.read())

        return f"media/{uname}"

    def remove(self, filename: str) -> None:
        full_path = os.path.join(self.upload_dir, filename)

        if not os.path.isfile(full_path):
            raise FileNotFoundError(f"File not found: {filename}")

        os.remove(full_path)
