import importlib
import os

SETTINGS_MODULE = os.getenv("FASTAPI_SETTINGS_MODULE", "settings")

settings = importlib.import_module(SETTINGS_MODULE).JWT_GUARD

