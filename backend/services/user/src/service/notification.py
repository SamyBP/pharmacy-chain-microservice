from abc import abstractmethod
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.settings import SMTP


class Notification:

    @abstractmethod
    def send(self, to: str, body: dict):
        pass


class EmailNotification(Notification):

    def __init__(self, *args, **kwargs):
        self.template_name = kwargs.get("template_name")
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
