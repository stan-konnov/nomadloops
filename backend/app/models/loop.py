from pydantic import BaseModel, Field

from app.models.place import Place


class Loop(BaseModel):
    """A data model to represent a full loop for a city."""

    city: str = Field(
        ...,
        description="Name of the city for which the loop is created.",
    )

    places: list[Place] = Field(
        default_factory=list,
        description="List of places in the loop representing a point of interest.",
    )
