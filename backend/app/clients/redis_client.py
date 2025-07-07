from __future__ import annotations

from collections.abc import MutableMapping, Sequence
from functools import lru_cache
from json import dumps, loads
from typing import Union

from aioredis import Redis

from app.settings import REDIS_URL

# Type for serializable and
# deserializable JSON values
JSONType = Union[
    str,
    int,
    float,
    bool,
    None,
    Sequence["JSONType"],
    MutableMapping[str, "JSONType"],
]


class RedisClient:
    """Redis client for managing connections and operations."""

    _instance: Redis

    @classmethod
    def connect(cls) -> None:
        """Initialize Redis client instance, creating it if it doesn't exist."""

        # We use class variable to guarantee
        # a singleton instance (of connection!)
        if cls._instance is None:
            cls._instance = Redis.from_url(
                REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
            )

    @classmethod
    async def close_connection(cls) -> None:
        """Close the Redis client connection if it exists."""

        if cls._instance:
            await cls._instance.close()

    async def set(self, key: str, value: JSONType) -> None:
        """Set a key-value pair in Redis with JSON serialization."""

        raw_value = dumps(value) if not isinstance(value, str) else value

        await self._instance.set(key, raw_value)

    async def get(self, key: str) -> JSONType | None:
        """Get a value by key from Redis with JSON deserialization."""

        raw_value = await self._instance.get(key)

        return loads(raw_value) if raw_value is not None else None


@lru_cache(maxsize=1)
def get_redis_client() -> RedisClient:
    """Return a singleton instance of Redis Client."""

    return RedisClient()
