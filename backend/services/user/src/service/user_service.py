from src.service.notification import EmailNotification


class UserService:

    def __call__(self, *args, **kwargs):
        return UserService()

    async def send_invite_email(self, to: str, verification_link: str):
        notification = EmailNotification(template_name="email/register-invitation.html")
        email_body = {"email": to, "verification_url": verification_link}
        await notification.send(to, email_body)
