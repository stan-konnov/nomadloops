from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import JSONResponse

from app.api.dtos.base_api_response import BaseApiResponseDto
from app.api.dtos.data_api_response import DataApiResponseDto
from app.api.v1.dtos.create_loops_request import CreateLoopsRequestDto
from app.errors.invariants import (
    LoopGenerationProcessAlreadyRunningError,
    LoopGenerationProcessNotFoundError,
)
from app.services.loops_management_service import LoopsManagementService
from app.utils.enums import LoopsGenerationStatus

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
                        "message": "Loops generation started successfully.",
                    },
                },
            },
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "Loops generation process is already running.",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "message": (
                            "Loops generation is already in progress. "
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
    """Kick off agent in the background to build the loops."""

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
            message="Loops generation started successfully.",
        ).model_dump(),
    )


@router.get(
    "/status",
    summary="Get loops generation status.",
    description="Get the current status of the loops generation process.",
    responses={
        HTTPStatus.OK: {
            "description": "Loops generation status retrieved successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Loops generation status retrieved successfully.",
                        "data": LoopsGenerationStatus.GENERATING.value,
                    },
                },
            },
        },
        HTTPStatus.NOT_FOUND: {
            "description": "No loops generation process found.",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "message": (
                            "No loops generation process found. "
                            "Please start a new generation process."
                        ),
                    },
                },
            },
        },
    },
)
async def get_loops_generation_status(
    loops_management_service: Annotated[
        LoopsManagementService,
        Depends(LoopsManagementService),
    ],
) -> JSONResponse:
    """Get loops generation status."""

    try:
        status = await loops_management_service.get_loops_generation_status()
    except LoopGenerationProcessNotFoundError as error:
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content=BaseApiResponseDto(
                success=False,
                message=str(error),
            ).model_dump(),
        )

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content=DataApiResponseDto(
            success=True,
            message="Loops generation status retrieved successfully.",
            data=status,
        ).model_dump(),
    )
