import os

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

VALID_FILE_EXTENSIONS = ("png", "jpeg", "jpg")
MAX_FILENAME_LENGTH = 250
FILENAME_FORBIDDEN_CHARACTERS = set(' !@#$%[]:{}?*\\')
FILE_UPLOAD_DIRECTORY = os.path.join(BASE_DIR, "..", "media")

FASTDBX = {
    "ENGINE": {
        "URL": "sqlite:///medication.db",
        "ECHO": True
    },
    "CREATE_TABLES": True
}

JWT_GUARD = {
    "MODEL": {
        "CLASSPATH": "",
        "USERNAME_FIELD": "",
        "PASSWORD_FIELD": "",
    },
    "JWT": {
        "SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
        "CLAIMS": ("id", "role")
    },
}
