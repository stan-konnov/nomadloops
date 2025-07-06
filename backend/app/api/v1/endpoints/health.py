from fastapi import APIRouter

from app.api.dtos.base_api_response import BaseApiResponseDto

router = APIRouter(prefix="/health")


@router.get(
    "/",
    summary="Health check.",
    response_description="Returns a success message if the API is running.",
)
async def health() -> BaseApiResponseDto:
    """Health check endpoint to verify that the API is running."""

    return BaseApiResponseDto(success=True, message="API is running.")
