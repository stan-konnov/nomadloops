from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
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
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "Loop generation process is already running.",
        },
    },
)
async def start_building_loop(
    request: CreateLoopsRequestDto,
    loops_management_service: Annotated[
        LoopsManagementService,
        Depends(LoopsManagementService),
    ],
) -> JSONResponse:
    """Kick off agents in the background to build the loops."""

    try:
        await loops_management_service.start_loop_creation(
            city=request.city,
            monthly_budget=request.monthly_budget,
            selected_categories=request.selected_categories,
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
