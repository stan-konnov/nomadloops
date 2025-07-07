from __future__ import annotations

from typing import TYPE_CHECKING

from app.clients.redis_client import get_redis_client
from app.utils.enums import LoopsGenerationStatus

if TYPE_CHECKING:
    from app.utils.enums import PlaceCategory


async def generate_loops(
    city: str,  # noqa: ARG001
    monthly_budget: float | None,  # noqa: ARG001
    selected_categories: list[PlaceCategory] | None,  # noqa: ARG001
) -> None:
    """Start loop creation via an agent call."""

    redis_client = get_redis_client()

    try:
        # 1. Agents stuff

        # 2. Store the loop itself

        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:  # noqa: BLE001
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
