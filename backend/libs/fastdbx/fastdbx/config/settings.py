import importlib
import os

from fastdbx.config.schemas import FastDbxConfig, EngineConfig
from fastdbx.core.exception import FastDbxException

SETTINGS_MODULE = os.getenv("FASTAPI_SETTINGS_MODULE", "settings")

try:
    settings = importlib.import_module(SETTINGS_MODULE).FASTDBX
except ImportError:
    raise FastDbxException("Did not find a settings module")
except KeyError:
    raise FastDbxException("Improperly configured. create dictionary FASTDBX to store your config")

Settings = FastDbxConfig(
    engine=EngineConfig(url=settings["ENGINE"]["URL"], echo=settings["ENGINE"].get("ECHO", True)),
    create_tables=settings["CREATE_TABLES"]
)
