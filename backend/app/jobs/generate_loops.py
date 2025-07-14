from __future__ import annotations

from json import dumps, loads
from logging import getLogger

import aiohttp

from app.clients.redis_client import get_redis_client
from app.settings import LLM_MODEL_ID, OLLAMA_API_URL
from app.utils.enums import LoopsGenerationStatus, PlaceCategory
from app.utils.prompt_reader import PromptReader

logger = getLogger(__name__)


async def generate_loops(
    city: str,
    monthly_budget: float,
    selected_categories: list[PlaceCategory],
    number_of_loops_to_generate: int,
) -> None:
    """Query local Ollama LLM to generate loops for a given city."""

    redis_client = get_redis_client()

    logger.info(
        f"Generating {number_of_loops_to_generate} loop(s) for {city}, "
        f"budget: {monthly_budget}, categories: {selected_categories}",
    )

    try:
        # Load the system prompt
        prompt_template = PromptReader.read_prompt("generate_loops")

        # User input in JSON
        user_input_json = dumps(
            {
                "city": city,
                "monthly_budget": monthly_budget,
                "selected_categories": selected_categories,
                "number_of_loops_to_generate": number_of_loops_to_generate,
            },
        )

        # Combine system prompt + user input
        full_prompt = f"{prompt_template}\n\n{user_input_json}"

        async with (
            aiohttp.ClientSession() as session,
            session.post(
                OLLAMA_API_URL,
                json={
                    "model": LLM_MODEL_ID,
                    "prompt": full_prompt,
                    "stream": False,
                },
            ) as response,
        ):
            response.raise_for_status()
            llm_response_content = (await response.json())["response"]

            # Parse out JSON from the response
            generated_loops = loads(llm_response_content)

            # If all good, store the generated loops in Redis
            await redis_client.set("loops", generated_loops)
            await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:
        logger.exception(f"Error generating loops for {city}")
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
