from __future__ import annotations

from pydantic import BaseModel, Field

from app.utils.enums import PlaceCategory  # noqa: TC001


class Coordinates(BaseModel):
    """A data model to represent a geographic coordinates."""

    lat: float = Field(..., description="Latitude of the coordinates.")

    lng: float = Field(..., description="Longitude of the coordinates.")


class Place(BaseModel):
    """A data model to represent a single point of interest in the nomad loop."""

    name: str = Field(..., description="Name of the place.")

    address: str = Field(..., description="Address of the place.")

    category: PlaceCategory = Field(
        ...,
        description="Category of the place, e.g., living, working, etc.",
    )

    url: str | None = Field(
        None,
        description="URL of the place, e.g., website or social media link.",
    )
    price: float | None = Field(
        None,
        description="Price of the place, e.g., cost of living or provided service.",
    )

    coordinates: Coordinates = Field(
        ...,
        description="Geographic coordinates of the place.",
    )
