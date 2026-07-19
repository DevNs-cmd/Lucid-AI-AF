"""Low-latency prompt response storage layer using Redis."""

import hashlib
import json
import logging
from typing import Any, Dict, Optional
import redis.asyncio as aioredis
from app.config.settings import settings

logger = logging.getLogger(__name__)


class AICache:
    """Provides fast key-value caching to reduce duplicate API model requests."""

    def __init__(self) -> None:
        """Establishes an active asynchronous connection to Redis pools."""
        self.redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

    @staticmethod
    def generate_key(prompt: str, system_instruction: Optional[str], **kwargs: Any) -> str:
        """Builds a secure SHA-256 identifier based on complete model execution inputs."""
        state = f"prompt:{prompt}|sys:{system_instruction or ''}|params:{sorted(kwargs.items())}"
        hashed = hashlib.sha256(state.encode("utf-8")).hexdigest()
        return f"lucid_ai_cache:{hashed}"

    async def get(
        self, prompt: str, system_instruction: Optional[str] = None, **kwargs: Any
    ) -> Optional[Dict[str, Any]]:
        """Retrieves previously cached query structures from the active Redis cluster."""
        key = self.generate_key(prompt, system_instruction, **kwargs)
        try:
            cached_data = await self.redis_client.get(key)
            if cached_data:
                logger.info("Found cached response for key: %s", key)
                return json.loads(cached_data)
        except Exception as exc:
            logger.error("AICache retrieval failed: %s", exc)
        return None

    async def set(
        self,
        prompt: str,
        system_instruction: Optional[str],
        response_data: Dict[str, Any],
        ttl_seconds: int = 3600,
        **kwargs: Any,
    ) -> None:
        """Stores a serialized query response in the Redis cache with a TTL limit."""
        key = self.generate_key(prompt, system_instruction, **kwargs)
        try:
            await self.redis_client.setex(
                name=key,
                time=ttl_seconds,
                value=json.dumps(response_data),
            )
            logger.info("Query successfully cached under key: %s with TTL: %ds", key, ttl_seconds)
        except Exception as exc:
            logger.error("AICache write failed: %s", exc)