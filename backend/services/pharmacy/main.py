from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastdbx.core import Datasource
from src.api.routers.pharmacy_router import pharmacy_router
from src.api.routers.pharmacy_employee_router import pharmacy_employee_router
from src.api.routers.pharmacy_manager_router import pharmacy_manager_router
from src.api.routers.pharmacy_internal_router import pharmacy_internal_router
import src.domain.models


@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    Datasource.instance().startup()
    yield
    Datasource.instance().shutdown()


app = FastAPI(lifespan=lifespan)

app.include_router(pharmacy_router, prefix="/api/pharmacies")
app.include_router(pharmacy_employee_router, prefix="/api/pharmacies/e")
app.include_router(pharmacy_manager_router, prefix="/api/pharmacies/m")
app.include_router(pharmacy_internal_router, prefix="/api/pharmacies/internal")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(httpx.HTTPError)
def handle_http_error(request: Request, e: httpx.HTTPError):
    return JSONResponse(
        status_code=500,
        content={
            "detail": f'Error making request at: {e.request.url}'
        }
    )
