from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
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

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(httpx.HTTPStatusError)
def handle_http_error(request: Request, e: httpx.HTTPStatusError):
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Error making request at: {e.request.url}",
            "message": e.response.json(),
        },
    )
