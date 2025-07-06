from __future__ import annotations

from typing import Generic, TypeVar

from app.api.dtos.base_api_response import BaseApiResponseDto

T = TypeVar("T")


class DataApiResponseDto(BaseApiResponseDto, Generic[T]):
    """
    Data API response DTO.

    Extends BaseApiResponseDto to include a generic `data` payload.
    """

    data: T | None = None
