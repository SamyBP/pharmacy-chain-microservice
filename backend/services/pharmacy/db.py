import os

from sqlmodel import create_engine, SQLModel, Session

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'pharmacy.db')


class Database:
    engine = create_engine(f"sqlite:///{DB_PATH}")

    @classmethod
    def create_tables(cls):
        SQLModel.metadata.create_all(cls.engine)

    @classmethod
    def session(cls):
        with Session(cls.engine) as session:
            yield session
