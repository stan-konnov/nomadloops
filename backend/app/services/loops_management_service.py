from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import BackgroundTasks

from app.clients.redis_client import get_redis_client
from app.errors.invariants import LoopGenerationProcessAlreadyRunningError
from app.jobs.generate_loops import generate_loops
from app.utils.enums import LoopsGenerationStatus

if TYPE_CHECKING:
    from app.utils.enums import PlaceCategory


class LoopsManagementService:
    """Service for managing loops."""

    def __init__(self) -> None:
        """Construct Loop Management Service."""

        self.redis_client = get_redis_client()

    async def start_loop_creation(
        self,
        city: str,
        monthly_budget: float | None,
        selected_categories: list[PlaceCategory] | None,
    ) -> None:
        """Start the loop creation process and return a unique loop ID."""

        currently_running_job_status = await self.redis_client.get("status")

        if currently_running_job_status == LoopsGenerationStatus.GENERATING.value:
            raise LoopGenerationProcessAlreadyRunningError(
                "A loop generation is already in progress. "
                "Please wait until it completes.",
            )

        background_tasks = BackgroundTasks()
        background_tasks.add_task(
            generate_loops,
            city,
            monthly_budget,
            selected_categories,
        )

        await self.redis_client.set("status", LoopsGenerationStatus.GENERATING.value)
