import os

from dotenv import load_dotenv

load_dotenv()

INVITE_VERIFICATION_CALLBACK_URL = os.getenv("FRONTEND_URL")

FASTDBX = {
    "ENGINE": {
        "URL": "sqlite:///user.db",
        "ECHO": True
    },
    "CREATE_TABLES": True
}

JWT_GUARD = {
    "MODEL": {
        "CLASSPATH": "src.domain.models.User",
        "USERNAME_FIELD": "email",
        "PASSWORD_FIELD": "password",
    },
    "JWT": {
        "SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
        "CLAIMS": ('id', 'role')
    }
}




