from __future__ import annotations

from typing import Any

from aioredis import Redis

from app.settings import REDIS_URL


class RedisClient:
    """Redis client for managing connections and operations."""

    client: Redis

    def __init__(self) -> None:
        """Construct Redis Client."""

        if not self.client:
            self.client = Redis.from_url(
                REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
            )

    async def close(self) -> None:
        """Close the Redis client connection."""

        if self.client:
            await self.client.close()

    async def set(self, key: str, value: Any) -> None:  # noqa: ANN401
        """Set a key-value pair in Redis."""

        await self.client.set(key, value)

    async def get(self, key: str) -> Any:  # noqa: ANN401
        """Get a value by key from Redis."""

        return await self.client.get(key)
