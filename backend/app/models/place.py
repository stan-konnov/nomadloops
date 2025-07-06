from __future__ import annotations

from typing import TYPE_CHECKING

from pydantic import BaseModel

if TYPE_CHECKING:
    from app.utils.enums import PlaceCategory


class Coordinates(BaseModel):
    """A data model to represent a geographic coordinates."""

    lat: float
    lng: float


class Place(BaseModel):
    """A data model to represent a single point of interest in the nomad loop."""

    name: str
    address: str
    category: PlaceCategory

    url: str | None
    price: str | None

    coordinates: Coordinates
