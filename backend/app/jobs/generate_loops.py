from __future__ import annotations

from json import dumps
from logging import getLogger
from typing import TYPE_CHECKING

from openai import AsyncOpenAI

from app.clients.redis_client import get_redis_client
from app.settings import OPENAI_API_KEY
from app.utils.enums import LoopsGenerationStatus, PlaceCategory
from app.utils.prompt_reader import PromptReader

if TYPE_CHECKING:
    from openai.types.chat import ChatCompletionMessageParam

logger = getLogger(__name__)


async def generate_loops(
    city: str,
    monthly_budget: float,
    selected_categories: list[PlaceCategory],
    number_of_loops_to_generate: int,
) -> None:
    """Query LLM to generate nomad loops for a given city."""

    redis_client = get_redis_client()
    openai_api_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    logger.info(
        f"Generating {number_of_loops_to_generate} loop(s) for {city}, "
        f"budget: {monthly_budget}, categories: {selected_categories}",
    )

    try:
        # Load in the prompt from the file
        prompt = PromptReader.read_prompt("generate_loops")

        # Construct the messages for the OpenAI API
        messages: list[ChatCompletionMessageParam] = [
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": dumps(
                    {
                        "city": city,
                        "monthly_budget": monthly_budget,
                        "selected_categories": selected_categories,
                        "number_of_loops_to_generate": number_of_loops_to_generate,
                    },
                ),
            },
        ]

        # Call OpenAI API
        llm_response = await openai_api_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=3000,
        )

        # Extract the content from the response
        content = llm_response.choices[0].message.content

        # And store the generated loops in Redis
        await redis_client.set("loops", dumps(content))
        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:
        logger.exception(
            f"Error generating loops for {city}",
        )
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
