"""Anthropic Claude model driver integration using AsyncAnthropic."""

import logging
from typing import Any, List, Optional
from anthropic import AsyncAnthropic
from app.ai.providers.base_provider import BaseAIProvider, ProviderResponse
from app.config.settings import settings
from app.core.exceptions import AIProviderServiceException

logger = logging.getLogger(__name__)


class AnthropicProvider(BaseAIProvider):
    """Executes asynchronous text message queries against Anthropic's Claude API."""

    def __init__(self, model_name: str = "claude-3-haiku-20240307") -> None:
        """Initializes client bindings to the AsyncAnthropic API endpoints."""
        if not settings.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY environment configuration is missing.")
        
        self.client = AsyncAnthropic(
            api_key=settings.ANTHROPIC_API_KEY,
            timeout=settings.AI_REQUEST_TIMEOUT_SECONDS,
        )
        self.model_name = model_name

    async def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stop_sequences: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> ProviderResponse:
        """Generates text using the configured Claude messaging models."""
        try:
            response = await self.client.messages.create(
                model=self.model_name,
                system=system_instruction or "",
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                stop_sequences=stop_sequences,
                **kwargs,
            )

            # Extract generated chunks from output block sequence
            generated_text = ""
            for block in response.content:
                if hasattr(block, "text"):
                    generated_text += block.text

            return ProviderResponse(
                content=generated_text,
                raw_response=response,
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            )
        except Exception as exc:
            logger.error("Anthropic execution failure: %s", exc, exc_info=True)
            raise AIProviderServiceException(
                detail=f"Anthropic Claude request failed for model: {self.model_name}",
                extra_details={"exception": str(exc)},
            ) from exc