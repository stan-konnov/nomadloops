from fastapi import FastAPI

app = FastAPI(
    title="NomadLoops API",
    description="An agent-powered API for generating digital nomad loops in any city.",
    version="0.1.0",
    docs_url="/docs",
)
