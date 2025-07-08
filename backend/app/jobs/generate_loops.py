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
    monthly_budget: float,
    selected_categories: list[PlaceCategory],
    number_of_loops_to_generate: int,
) -> None:
    """Query LLM to generate nomad loops for a given city."""

    openai.api_key = OPENAI_API_KEY
    redis_client = get_redis_client()

    logger.info(
        f"Generating {number_of_loops_to_generate} loop(s) for {city}, "
        f"budget: {monthly_budget}, categories: {selected_categories}",
    )

    try:
        # Load in the prompt from the file
        prompt = PromptReader.read_prompt("generate_loops")

        # Get categories strings from the selected categories
        _categories = [category.value for category in selected_categories]

        _system = {
            "role": "system",
            "content": prompt,
        }

        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:  # noqa: BLE001
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
