from __future__ import annotations

from json import dumps, loads
from logging import getLogger

from huggingface_hub import AsyncInferenceClient

from app.clients.redis_client import get_redis_client
from app.settings import HUGGINGFACE_API_TOKEN, LLM_MODEL_ID
from app.utils.enums import LoopsGenerationStatus, PlaceCategory
from app.utils.prompt_reader import PromptReader

logger = getLogger(__name__)


async def generate_loops(
    city: str,
    monthly_budget: float,
    selected_categories: list[PlaceCategory],
    number_of_loops_to_generate: int,
) -> None:
    """Query LLM to generate loops for a given city."""

    redis_client = get_redis_client()
    huggingface_client = AsyncInferenceClient(api_key=HUGGINGFACE_API_TOKEN)

    logger.info(
        f"Generating {number_of_loops_to_generate} loop(s) for {city}, "
        f"budget: {monthly_budget}, categories: {selected_categories}",
    )

    try:
        # Load in the prompt from the file
        prompt = PromptReader.read_prompt("generate_loops")

        # Define messages for the LLM
        messages = [
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

        # Query the LLM to generate loops
        llm_response = await huggingface_client.chat.completions.create(
            model=LLM_MODEL_ID,
            messages=messages,
            max_tokens=8000,
            temperature=0.7,
        )
        llm_response_content = llm_response.choices[0].message.content

        # Parse out JSON from the response content
        generated_loops = loads(llm_response_content)  # type: ignore  # noqa: PGH003

        # If all good, store the generated loops in Redis
        await redis_client.set("loops", generated_loops)
        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:
        logger.exception(f"Error generating loops for {city}")
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
