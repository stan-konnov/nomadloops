from __future__ import annotations

from pydantic import BaseModel, Field

from app.utils.enums import PlaceCategory  # noqa: TC001


class CreateLoopRequestDto(BaseModel):
    """DTO for creating a new loop request."""

    city: str = Field(..., description="City for which to generate the loop.")

    monthly_budget: float | None = Field(
        None,
        description="If provided, the loop will be optimized to fit the budget.",
    )

    selected_categories: list[PlaceCategory] | None = Field(
        None,
        description=(
            "If provided, the loop will be optimized to include only these categories."
        ),
    )
