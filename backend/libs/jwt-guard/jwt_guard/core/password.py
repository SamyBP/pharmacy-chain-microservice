import bcrypt

from jwt_guard.core.exceptions import JwtGuardException, ImproperlyConfiguredException


def check_hashpw_matches_plain(plain_pw: str, hashpw: str):
    if isinstance(hashpw, str):
        hashpw = hashpw.encode()

    if not bcrypt.checkpw(plain_pw.encode(), hashpw):
        raise JwtGuardException("Could not match passwords")


def get_authmodel_pw_attr(authmodel, password_field):
    pw_attr = getattr(authmodel, password_field, None)

    if pw_attr is None:
        raise ImproperlyConfiguredException(
            f"""
            Improperly configured, 
            Set your authmodel password field correctly, currently using: {password_field}
            """
        )

    return pw_attr
