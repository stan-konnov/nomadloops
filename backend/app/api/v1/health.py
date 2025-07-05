from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Health check", response_description="Health status")
async def health() -> None:
    """Health check endpoint to verify that the API is running."""
    return
