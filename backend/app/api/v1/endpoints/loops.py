from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dtos.base_api_response import BaseApiResponseDto
from app.api.v1.dtos.create_loop_request import CreateLoopRequestDto
from app.services.loops_management_service import LoopsManagementService

router = APIRouter(prefix="/loops")


@router.post(
    "/",
    summary="Start building nomad loops.",
    description="Kick off the agent in the background to build the loops.",
)
async def start_building_loop(
    request: CreateLoopRequestDto,
    loops_management_service: Annotated[
        LoopsManagementService,
        Depends(LoopsManagementService),
    ],
) -> BaseApiResponseDto:
    """Kick off the agent in the background to build the loop. Returns an ID."""

    await loops_management_service.start_loop_creation(
        city=request.city,
        monthly_budget=request.monthly_budget,
        selected_categories=request.selected_categories,
    )

    return BaseApiResponseDto(
        success=True,
        message="Loops generation started.",
    )
