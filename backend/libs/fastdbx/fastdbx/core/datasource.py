from contextlib import contextmanager
from contextvars import ContextVar
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from fastdbx.config import Settings
from fastdbx.config.schemas import FastDbxConfig
from fastdbx.core.model import BaseEntity


class Datasource:
    _instance: Optional["Datasource"] = None

    def __init__(self, settings: FastDbxConfig = Settings):
        self._engine = create_engine(**settings.engine.dict())
        self._session_factory = sessionmaker(bind=self._engine, expire_on_commit=False)
        self._session_context = ContextVar("db_session", default=None)
        self._should_create_tables = settings.create_tables

    @classmethod
    def instance(cls, settings: FastDbxConfig = Settings) -> "Datasource":
        if cls._instance is None:
            cls._instance = Datasource(settings)
        return cls._instance

    def startup(self):
        if self._should_create_tables:
            with self._engine.connect() as connection:
                BaseEntity.metadata.create_all(connection)

    def shutdown(self):
        self._engine.dispose()
        Datasource._instance = None

    @contextmanager
    def session(self):
        _session = self._session_context.get()

        if _session is None:
            _session = self._session_factory()
            self._session_context.set(_session)

        try:
            yield _session
        except Exception:
            _session.close()
            raise
        finally:
            self._session_context.set(None)

    @property
    def context(self):
        return self._session_context.get()
