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
            "content": (
                """
                Hello!

                You are a highly reliable, data-oriented assistant with deep expertise in travel, the digital nomad lifestyle, and local culture around the world.
                Your task is to generate one or more **nomad loops** for a given city.
                A nomad loop is a list of places that are essential for a digital nomad living in that city — exactly one place per requested category.

                OUTPUT FORMAT:
                - You must output a **single valid JSON array of loop objects**, and nothing else.
                - The JSON must start with `[` and end with `]`, and contain no text or comments before or after.
                - The JSON must be syntactically correct and directly parsable.

                LOOP OBJECT STRUCTURE:
                Each loop object in the array must have the following keys:
                {
                "city": "<exact name of the city as provided>",
                "items": [
                    {
                    "name": "<realistic name of the place>",
                    "category": "<one of the requested categories>",
                    "address": "<specific street address, area, or district — realistic for the city>",
                    "url": "<direct website URL or Google Maps link, or leave empty if none is known>",
                    "coordinates": {
                        "lat": <float>,  // approximate decimal latitude, always include
                        "lng": <float>   // approximate decimal longitude, always include
                    },
                    "price": "<single number with currency, e.g., '450 USD'>"
                    },
                    … (exactly one item per category) …
                ]
                }

                GUIDELINES:
                - Always include one (and only one) item per requested category in each loop.
                - If data for a category is scarce in the city, invent plausible but culturally appropriate examples.
                - If a monthly budget is provided, make the loops realistic within that budget.
                - If multiple loops are requested, make them meaningfully different — for example:
                    • vary by price level (budget, midrange, premium)
                    • vary by neighborhood or district
                    • vary by lifestyle (quiet, vibrant, social, secluded, etc.)
                - Place names, addresses, and URLs must be realistic and match the culture of the city.
                - Prices must always be a single number followed by the currency (e.g., '1200 USD', '4000 THB').
                - Coordinates must always be floats, and reasonably close to the actual location (approximation is acceptable).

                VALIDATION:
                - Do NOT include any explanation, commentary, or text outside the JSON.
                - Do NOT omit or rename any required fields.
                - Do NOT return malformed or partial JSON — ensure it is valid and complete.

                Example of the final output format:
                [
                {
                    "city": "Bangkok",
                    "items": [
                    {
                        "name": "Nomad Nest Hostel",
                        "category": "living",
                        "address": "123 Sukhumvit Soi 11, Bangkok",
                        "url": "https://maps.google.com/…",
                        "coordinates": { "lat": 13.743, "lng": 100.535 },
                        "price": "350 USD"
                    },
                    …
                    ]
                },
                …
                ]

                When ready, return **only the JSON array of loop objects**, nothing else.
                """  # noqa: E501
            ),
        }

        await redis_client.set("status", LoopsGenerationStatus.READY.value)

    except Exception:  # noqa: BLE001
        await redis_client.set("status", LoopsGenerationStatus.ERROR.value)
