from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks

from app.api.dtos.data_api_response import DataApiResponseDto
from app.api.v1.dtos.create_loop_request import CreateLoopRequestDto
from app.api.v1.dtos.loop_creation_started_response import (
    LoopCreationStartedResponseDto,
)

router = APIRouter(prefix="/loop")


@router.post(
    "/",
    summary="Start building a nomad loop.",
    description="Kick off the agent in the background to build the loop. Return an ID.",
)
async def start_building_loop(
    _request: CreateLoopRequestDto,
    _background_tasks: BackgroundTasks,
) -> DataApiResponseDto[LoopCreationStartedResponseDto]:
    """Kick off the agent in the background to build the loop. Returns an ID."""

    loop_id = uuid4()

    return DataApiResponseDto[LoopCreationStartedResponseDto](
        success=True,
        message="Loop generation started.",
        data=LoopCreationStartedResponseDto(loop_id=str(loop_id)),
    )
