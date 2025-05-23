from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastdbx import Datasource

from src.api.routers.medication_router import medication_router

load_dotenv()


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(medication_router, prefix="api/medications")



