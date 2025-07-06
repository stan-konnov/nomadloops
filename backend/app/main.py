import uvicorn
from fastapi import FastAPI

from app.api.v1.router import router as v1_router
from app.settings import ENVIRONMENT, HOST, PORT, VERSION

app = FastAPI(
    title="NomadLoops API",
    description="An agent-powered API for generating digital nomad loops in any city.",
    version=VERSION,
    docs_url="/docs",
)

app.include_router(v1_router)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=ENVIRONMENT in ["development", "testing"],
    )
