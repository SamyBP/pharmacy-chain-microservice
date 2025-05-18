from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastdbx.core import Datasource
from src.api.routers.pharmacy_router import pharmacy_router
import src.domain.models


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(pharmacy_router, prefix="/api/pharmacies")


@app.exception_handler(httpx.HTTPError)
def handle_http_error(request: Request, e: httpx.HTTPError):
    return JSONResponse(
        status_code=500,
        content={
            "detail": f'Error making request at: {e.request.url}'
        }
    )
