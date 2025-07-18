from collections.abc import AsyncGenerator
from typing import Any

import uvicorn
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse

from app.api.router import router
from app.clients.redis_client import RedisClient
from app.settings import ENVIRONMENT, FRONTEND_URL, HOST, PORT, VERSION


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:  # noqa: ARG001
    """Close resource (Redis client) on application shutdown."""

    yield
    await RedisClient.close_connection()


app = FastAPI(
    docs_url=None,
    redoc_url=None,
    version=VERSION,
    title="NomadLoops API",
    description="An agent-powered API for generating digital nomad loops in any city.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get(
    "/docs",
    summary="Swagger UI",
    response_description="Swagger UI for API documentation",
    include_in_schema=False,
)
async def custom_swagger_ui() -> HTMLResponse:
    """Render the Swagger UI for API documentation."""

    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="NomadLoops API Docs",
    )


@app.get(
    "/openapi.json",
    summary="OpenAPI JSON",
    response_description="OpenAPI JSON schema for the API",
    include_in_schema=False,
)
async def custom_openapi() -> dict[str, Any]:
    """Generate and return the OpenAPI schema for the API."""

    return get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
        description=app.description,
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=ENVIRONMENT in ["development", "testing"],
    )
