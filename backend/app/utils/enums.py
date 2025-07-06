from enum import Enum


class PlaceCategory(str, Enum):
    """Enum of possible place categories in a nomad loop."""

    LIVING = "living"
    WORKING = "working"
    TRAINING = "training"
    SHOPPING = "shopping"
    ACTIVITIES = "activities"
