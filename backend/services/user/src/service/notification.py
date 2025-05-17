import logging
from abc import abstractmethod
from enum import Enum
from typing import Optional

from fastapi import HTTPException

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from src.domain.dtos.user import UserOut
from src.settings import SMTP, TWILIO_SID, TWILIO_SENDER_NO, TWILIO_AUTH_TOKEN
from twilio.rest import Client

logger = logging.getLogger("uvicorn.error")


class NotificationAction(Enum):
    ACCOUNT_DELETED = 1
    ACCOUNT_UPDATED = 2

    @staticmethod
    def get_message_from_action(action: "NotificationAction") -> dict:
        if action == NotificationAction.ACCOUNT_DELETED:
            return {"message": "Your account has been deleted"}
        elif action == NotificationAction.ACCOUNT_UPDATED:
            return {"message": "Your account has be updated"}

        raise HTTPException(
            status_code=500,
            detail=f"Wrong usage of notification action: {action.value}"
        )


class Notification:

    @abstractmethod
    async def send(self, to: str, body: dict):
        pass

    @staticmethod
    def create_for_user(user: UserOut) -> tuple[Optional["Notification"], Optional[str]]:
        if user.notification_preference is None:
            return None, None

        if user.notification_preference == 'EMAIL':
            return EmailNotification(template_name="email/generic-notification.html"), user.email

        if user.notification_preference == 'SMS':
            return SMSNotification(), user.phone_number

        raise HTTPException(status_code=500, detail=f"Unknown notification preference {user.notification_preference}")


class EmailNotification(Notification):

    def __init__(self, *, template_name):
        self.template_name = template_name
        self.conf = ConnectionConfig(
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            TEMPLATE_FOLDER='src/domain/templates',
            **SMTP
        )

    async def send(self, to: str, body: dict):
        message = MessageSchema(
            recipients=[to],
            template_body=body,
            subtype='html'
        )

        fm = FastMail(self.conf)
        await fm.send_message(message, template_name=self.template_name)


class SMSNotification(Notification):

    def __init__(self):
        self.sender = TWILIO_SENDER_NO
        self.client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

    async def send(self, to: str, body: dict):
        self.client.messages.create(
            from_=self.sender,
            to=to,
            body=body.get("message")
        )
