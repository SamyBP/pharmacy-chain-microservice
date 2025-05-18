import os

from dotenv import load_dotenv

load_dotenv()

MEDICATION_SERVICE_BASE_URL = os.getenv("MEDICATION_SERVICE_BASE_URL", "http://localhost:8001/api")

FASTDBX = {
    "ENGINE": {
        "URL": "sqlite:///pharmacy.db",
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
