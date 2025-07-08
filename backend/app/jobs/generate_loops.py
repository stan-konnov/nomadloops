from __future__ import annotations

import openai

from app.clients.redis_client import get_redis_client
from app.settings import OPENAI_API_KEY
from app.utils.enums import LoopsGenerationStatus, PlaceCategory


async def generate_loops(
    _city: str,
    _monthly_budget: float | None,
    selected_categories: list[PlaceCategory] | None,
) -> None:
    """Query LLM to generate nomad loops for a given city."""

    openai.api_key = OPENAI_API_KEY
    redis_client = get_redis_client()

    try:
        # Use provided categories or default to all
        _categories = selected_categories or [
            category.value for category in PlaceCategory
        ]

        # The gist of things: generate clear,
        # actionable prompt for LLM to act on
        _system = {
            "role": "system",
            "content": "...",
        }

        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:  # noqa: BLE001
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
