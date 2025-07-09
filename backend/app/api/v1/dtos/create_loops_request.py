from __future__ import annotations

from pydantic import BaseModel, Field

from app.settings import DEFAULT_BUDGET
from app.utils.enums import PlaceCategory


class CreateLoopsRequestDto(BaseModel):
    """DTO for creating a new loop request."""

    city: str = Field(..., description="City for which to generate the loop.")

    monthly_budget: float = Field(
        DEFAULT_BUDGET,
        ge=0.0,
        description="Monthly budget for the loop. Must be a positive float.",
    )

    selected_categories: list[PlaceCategory] = Field(
        [
            PlaceCategory.LIVING,
            PlaceCategory.WORKING,
            PlaceCategory.TRAINING,
        ],
        description=(
            "List of categories to include in "
            "the loop. Defaults to living, working, training."
        ),
    )

    number_of_loops_to_generate: int = Field(
        1,
        ge=1,
        le=3,
        description=("Number of loops to generate. Defaults to 1, maximum is 3."),
    )
