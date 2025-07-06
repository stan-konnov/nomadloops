from fastapi import FastAPI

from app.api.v1.router import router as v1_router

app = FastAPI(
    title="NomadLoops API",
    description="An agent-powered API for generating digital nomad loops in any city.",
    version="0.1.0",
    docs_url="/docs",
)

app.include_router(v1_router)
