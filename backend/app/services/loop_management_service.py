from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import uuid4

from fastapi import BackgroundTasks

from app.clients.redis_client import get_redis_client
from app.jobs.create_loop import create_loop
from app.utils.enums import LoopStatus

if TYPE_CHECKING:
    from app.utils.enums import PlaceCategory


class LoopManagementService:
    """Service for managing loops."""

    def __init__(self) -> None:
        """Construct Loop Management Service."""

        self.redis_client = get_redis_client()

    async def start_loop_creation(
        self,
        city: str,
        monthly_budget: float | None,
        selected_categories: list[PlaceCategory] | None,
    ) -> str:
        """Start the loop creation process and return a unique loop ID."""

        loop_id = str(uuid4())

        background_tasks = BackgroundTasks()
        background_tasks.add_task(
            create_loop,
            loop_id,
            city,
            monthly_budget,
            selected_categories,
        )

        await self.redis_client.set(f"{loop_id}:status", LoopStatus.CREATING.value)

        return loop_id
