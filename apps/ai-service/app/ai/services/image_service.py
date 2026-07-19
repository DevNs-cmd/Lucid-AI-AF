"""Async wrapper querying DALL-E endpoints for scene illustrations."""

import logging
from openai import AsyncOpenAI
from app.config.settings import settings
from app.core.exceptions import AIProviderServiceException

logger = logging.getLogger(__name__)


class ImageService:
    """Provides scene visual illustration generations."""

    def __init__(self) -> None:
        """Initializes client configurations wrapping OpenAI's image service."""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment configuration is missing.")
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_scene_illustration(
        self, prompt: str, quality: str = "standard", size: str = "1024x1024"
    ) -> str:
        """Queries DALL-E models to generate scene illustration image URLs.

        Args:
            prompt: Visual style description instruction.
            quality: Generation resolution parameters.
            size: Dimension boundaries.

        Returns:
            The generated image URL string.
        """
        try:
            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                quality=quality,  # type: ignore
                size=size,  # type: ignore
                response_format="url",
            )
            image_url = response.data[0].url
            if not image_url:
                raise AIProviderServiceException(detail="Image service failed to return an output URL.")
            return image_url
        except Exception as exc:
            logger.error("DALL-E image generation request failed: %s", exc)
            raise AIProviderServiceException(
                detail="Scene illustration request failed."
            ) from exc