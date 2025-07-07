from app.clients.redis_client import get_redis_client


class LoopManagementService:
    """Service for managing loops."""

    def __init__(self) -> None:
        """Construct Loop Management Service."""

        self.redis_client = get_redis_client()
        self.redis_client.connect()
