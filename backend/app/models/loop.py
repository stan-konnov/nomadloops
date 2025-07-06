from pydantic import BaseModel

from app.models.place import Place


class Loop(BaseModel):
    """A data model to represent a full loop for a city."""

    city: str
    places: list[Place] = []
