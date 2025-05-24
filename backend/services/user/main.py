from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastdbx import Datasource
from jwt_guard.api.routers import jwt_guard_router

from src.api.routers import user_router
import src.domain.models


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield
    Datasource.instance().shutdown()


app = FastAPI(lifespan=lifespan)

app.include_router(jwt_guard_router, prefix="/api/auth")
app.include_router(user_router)
