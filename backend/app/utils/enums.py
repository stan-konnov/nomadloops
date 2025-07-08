from enum import Enum


class PlaceCategory(str, Enum):
    """Enum of possible place categories in a nomad loop."""

    # Apartments, hostels, Airbnbs
    LIVING = "living"

    # Coworking spaces and cafes with Wi-Fi
    WORKING = "working"

    # Laundromats
    LAUNDRY = "laundry"

    # Gyms
    TRAINING = "training"

    # Metro, bus stations, scooter rentals
    TRANSPORT = "transport"

    # ATMs, bank branches, currency exchange
    BANKING_FINANCE = "banking_finance"

    # Grocery stores and supermarkets
    GROCERY_SHOPPING = "grocery_shopping"

    # Clinics, pharmacies, spas
    HEALTHCARE_WELLNESS = "healthcare_wellness"

    # Police, fire stations, consulates
    EMERGENCY_ESSENTIALS = "emergency_essentials"


class LoopsGenerationStatus(str, Enum):
    """Enum of possible statuses of a loop generation process."""

    # Loops are ready
    READY = "ready"

    # Loop generation failed
    ERROR = "error"

    # Loop generation is in progress
    GENERATING = "generating"
