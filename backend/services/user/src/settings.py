import os

from dotenv import load_dotenv

load_dotenv()

PHARMACY_SERVICE_BASE_API_URL = os.getenv(
    "PHARMACY_SERVICE_BASE_API_URL", "http://localhost:8000/api/pharmacies"
)

PHARMACY_SERVICE_API_KEY = os.getenv("PHARMACY_SERVICE_API_KEY")

INVITE_VERIFICATION_CALLBACK_URL = os.getenv("FRONTEND_URL")
TWILIO_SENDER_NO = os.getenv("TWILIO_SENDER_NO")
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")

FASTDBX = {"ENGINE": {"URL": "sqlite:///user.db", "ECHO": True}, "CREATE_TABLES": True}

JWT_GUARD = {
    "MODEL": {
        "CLASSPATH": "src.domain.models.User",
        "USERNAME_FIELD": "email",
        "PASSWORD_FIELD": "password",
    },
    "JWT": {"SECRET_KEY": os.getenv("JWT_SECRET_KEY"), "CLAIMS": ("id", "role")},
}

SMTP = {
    "MAIL_SERVER": "smtp.sendgrid.net",
    "MAIL_PORT": 587,
    "MAIL_USERNAME": os.getenv("SMTP_EMAIL_USERNAME"),
    "MAIL_PASSWORD": os.getenv("SMTP_EMAIL_PASSWORD"),
    "MAIL_FROM": os.getenv("SMTP_EMAIL_FROM"),
}
