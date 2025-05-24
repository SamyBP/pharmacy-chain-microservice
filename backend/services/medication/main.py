from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.api.routers.manufacturer_router import manufacturer_router

from fastdbx import Datasource

from src.api.routers.medication_router import medication_router
import src.domain.models

load_dotenv()


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield
    Datasource.instance().shutdown()

app = FastAPI(lifespan=lifespan)

app.include_router(medication_router, prefix="/api/medications")
app.include_router(manufacturer_router, prefix="/api/medications/manufacturers")
app.mount("/media", StaticFiles(directory="media"), name="media")
