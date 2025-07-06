from __future__ import annotations

from pydantic import BaseModel


class Coordinates(BaseModel):
    """A data model to represent a geographic coordinates."""

    lat: float
    lng: float


class Place(BaseModel):
    """A data model to represent a single point of interest in the nomad loop."""

    name: str
    address: str
    category: str

    url: str | None
    price: str | None

    coordinates: Coordinates
