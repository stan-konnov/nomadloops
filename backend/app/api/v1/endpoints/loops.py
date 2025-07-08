from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import JSONResponse

from app.api.dtos.base_api_response import BaseApiResponseDto
from app.api.v1.dtos.create_loops_request import CreateLoopsRequestDto
from app.errors.invariants import LoopGenerationProcessAlreadyRunningError
from app.services.loops_management_service import LoopsManagementService

router = APIRouter(prefix="/loops")


@router.post(
    "/",
    summary="Start building nomad loops.",
    description="Kick off agents in the background to build the loops.",
    responses={
        HTTPStatus.CREATED: {
            "description": "Loop generation started successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Loop generation started successfully.",
                    },
                },
            },
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "Loop generation process is already running.",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "message": (
                            "A loop generation is already in progress. "
                            "Please wait until it completes."
                        ),
                    },
                },
            },
        },
    },
)
async def start_building_loops(
    request: CreateLoopsRequestDto,
    loops_management_service: Annotated[
        LoopsManagementService,
        Depends(LoopsManagementService),
    ],
    background_tasks: BackgroundTasks,
) -> JSONResponse:
    """Kick off agents in the background to build the loops."""

    try:
        await loops_management_service.start_loop_creation(
            city=request.city,
            monthly_budget=request.monthly_budget,
            selected_categories=request.selected_categories,
            number_of_loops_to_generate=request.number_of_loops_to_generate,
            background_tasks=background_tasks,
        )

    except LoopGenerationProcessAlreadyRunningError as error:
        return JSONResponse(
            status_code=HTTPStatus.BAD_REQUEST,
            content=BaseApiResponseDto(
                success=False,
                message=str(error),
            ).model_dump(),
        )

    return JSONResponse(
        status_code=HTTPStatus.CREATED,
        content=BaseApiResponseDto(
            success=True,
            message="Loop generation started successfully.",
        ).model_dump(),
    )
