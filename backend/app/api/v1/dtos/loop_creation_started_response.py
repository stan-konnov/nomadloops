from pydantic import BaseModel, Field


class LoopCreationStartedResponseDto(BaseModel):
    """DTO for loop creation started event."""

    loop_id: str = Field(..., description="Unique identifier for the loop.")
