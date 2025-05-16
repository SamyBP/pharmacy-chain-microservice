from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends

from db import Database
from services.pharmacy_service import PharmacyService
import context


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Database.create_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root(pharmacy_service: PharmacyService = Depends(context.get_pharmacy_service)):
    return pharmacy_service.get_all_pharmacies()
