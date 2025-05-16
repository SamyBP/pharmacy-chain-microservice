import importlib
import os
from datetime import timedelta
from functools import cached_property

from pydantic import BaseModel, Field

from jwt_guard.core.exceptions import ImproperlyConfiguredException

SETTINGS_MODULE = os.getenv("FASTAPI_SETTINGS_MODULE", "settings")

try:
    settings = importlib.import_module(SETTINGS_MODULE).JWT_GUARD
except KeyError:
    raise ImproperlyConfiguredException(
        "Improperly configured, try creating a JWT_GUARD dictionary to store your settings"
    )
except ImportError:
    raise ImproperlyConfiguredException(
        """
        Improperly configured, 
        try setting the FASTAPI_SETTINGS_MODULE environment variable to point to your project settings module
        """
    )

if "MODEL" not in settings:
    raise ImproperlyConfiguredException(
        """
        Improperly configured,
        You must include a MODEL dict inside your config dictionary
        """
    )

if "JWT" not in settings:
    raise ImproperlyConfiguredException(
        """
        Improperly configured,
        You must include a JWT dict inside your config dictionary
        """
    )


class ModelSettings(BaseModel):
    classpath: str = Field(alias="CLASSPATH")
    username_field: str = Field(alias="USERNAME_FIELD")
    password_field: str = Field(alias="PASSWORD_FIELD", default="password")

    @cached_property
    def authmodel(self):
        try:
            module_name, class_name = self.classpath.rsplit('.', 1)
            auth_model_module = importlib.import_module(module_name)
            return getattr(auth_model_module, class_name)
        except (ImportError, AttributeError) as e:
            raise ImproperlyConfiguredException(
                f"""
                Improperly configured,
                Could not load class {self.classpath}: {e}
                """
            )


class JwtSettings(BaseModel):
    secret_key: str = Field(alias="SECRET_KEY")
    algorithm: str = Field(alias="ALGORITHM", default="HS256")
    token_lifetime: timedelta = Field(alias="TOKEN_LIFETIME", default=timedelta(days=1))
    claims: tuple[str, ...] = Field(alias="CLAIMS", default=())


class OpenAPISettings(BaseModel):
    tags: list[str] = Field(alias="TAGS", default=["jwt-guard"])


class JwtGuardConfig(BaseModel):
    model: ModelSettings
    jwt: JwtSettings
    open_api: OpenAPISettings = Field(alias="OPEN_API", default=OpenAPISettings())


config = JwtGuardConfig(
    model=ModelSettings(**settings["MODEL"]),
    jwt=JwtSettings(**settings["JWT"]),
)

if "OPEN_API" in settings:
    config.open_api = JwtGuardConfig(**settings["OPEN_API"])
