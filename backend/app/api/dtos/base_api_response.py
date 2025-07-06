from pydantic import BaseModel


class BaseApiResponseDto(BaseModel):
    """
    Base API response DTO.

    Serves as a base for all API response DTOs.
    Extendable to include additional fields as needed.
    """

    success: bool
    message: str
