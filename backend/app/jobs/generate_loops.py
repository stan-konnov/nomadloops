from __future__ import annotations

from logging import getLogger

import openai

from app.clients.redis_client import get_redis_client
from app.settings import OPENAI_API_KEY
from app.utils.enums import LoopsGenerationStatus, PlaceCategory
from app.utils.prompt_reader import PromptReader

logger = getLogger(__name__)


async def generate_loops(
    city: str,
    monthly_budget: float | None,
    selected_categories: list[PlaceCategory] | None,
) -> None:
    """Query LLM to generate nomad loops for a given city."""

    openai.api_key = OPENAI_API_KEY
    redis_client = get_redis_client()

    logger.info(
        f"Generating loops for city: {city}, "
        f"budget: {monthly_budget}, categories: {selected_categories}",
    )

    try:
        # Use provided categories or default to all
        _categories = selected_categories or [
            category.value for category in PlaceCategory
        ]

        # Load in the prompt from the file
        prompt = PromptReader.read_prompt("generate_loops")

        _system = {
            "role": "system",
            "content": prompt,
        }

        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:  # noqa: BLE001
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
