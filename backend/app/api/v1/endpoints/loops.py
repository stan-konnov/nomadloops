from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dtos.data_api_response import DataApiResponseDto
from app.api.v1.dtos.create_loop_request import CreateLoopRequestDto
from app.api.v1.dtos.loop_creation_started_response import (
    LoopCreationStartedResponseDto,
)
from app.services.loop_management_service import LoopManagementService

router = APIRouter(prefix="/loop")


@router.post(
    "/",
    summary="Start building a nomad loop.",
    description="Kick off the agent in the background to build the loop. Return an ID.",
)
async def start_building_loop(
    request: CreateLoopRequestDto,
    loop_management_service: Annotated[
        LoopManagementService,
        Depends(LoopManagementService),
    ],
) -> DataApiResponseDto[LoopCreationStartedResponseDto]:
    """Kick off the agent in the background to build the loop. Returns an ID."""

    loop_id = await loop_management_service.start_loop_creation(
        city=request.city,
        monthly_budget=request.monthly_budget,
        selected_categories=request.selected_categories,
    )

    return DataApiResponseDto[LoopCreationStartedResponseDto](
        success=True,
        message="Loop generation started.",
        data=LoopCreationStartedResponseDto(loop_id=str(loop_id)),
    )
