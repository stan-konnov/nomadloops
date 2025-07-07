from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import uuid4

from app.clients.redis_client import get_redis_client
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
        city: str,  # noqa: ARG002
        monthly_budget: float | None,  # noqa: ARG002
        selected_categories: list[PlaceCategory] | None,  # noqa: ARG002
    ) -> str:
        """Start the loop creation process and return a unique loop ID."""

        loop_id = str(uuid4())

        await self.redis_client.set(
            loop_id,
            {
                "status": LoopStatus.CREATING.value,
            },
        )

        return loop_id
