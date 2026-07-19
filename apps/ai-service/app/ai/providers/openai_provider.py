"""OpenAI model driver implementation using AsyncOpenAI."""

import logging
from typing import Any, List, Optional
from openai import AsyncOpenAI
from app.ai.providers.base_provider import BaseAIProvider, ProviderResponse
from app.config.settings import settings
from app.core.exceptions import AIProviderServiceException

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseAIProvider):
    """Executes asynchronous chat completion queries against the OpenAI API."""

    def __init__(self, model_name: str = "gpt-4o-mini") -> None:
        """Initializes the AsyncOpenAI connection wrapper."""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment configuration is missing.")
        
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            organization=settings.OPENAI_ORGANIZATION_ID,
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
        """Generates text using the configured OpenAI chat model."""
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        try:
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,  # type: ignore
                temperature=temperature,
                max_tokens=max_tokens,
                stop=stop_sequences,
                **kwargs,
            )

            usage = response.usage
            input_tokens = usage.prompt_tokens if usage else 0
            output_tokens = usage.completion_tokens if usage else 0

            return ProviderResponse(
                content=response.choices[0].message.content or "",
                raw_response=response,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            )
        except Exception as exc:
            logger.error("OpenAI execution failure: %s", exc, exc_info=True)
            raise AIProviderServiceException(
                detail=f"OpenAI service request failed for model: {self.model_name}",
                extra_details={"exception": str(exc)},
            ) from exc