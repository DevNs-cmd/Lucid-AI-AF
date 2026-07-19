"""Google Gemini model driver integration using the official generativeai library."""

import logging
from typing import Any, List, Optional
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from app.ai.providers.base_provider import BaseAIProvider, ProviderResponse
from app.config.settings import settings
from app.core.exceptions import AIProviderServiceException

logger = logging.getLogger(__name__)


class GeminiProvider(BaseAIProvider):
    """Executes asynchronous generative queries against Google's Gemini models."""

    def __init__(self, model_name: str = "gemini-1.5-flash") -> None:
        """Configures connection credentials to Google's AI interface."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY environment configuration is missing.")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
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
        """Generates text using the configured Gemini model engine."""
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction,
            )

            config = GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
                stop_sequences=stop_sequences,
                **kwargs,
            )

            # Prefetch token counts via Google's helper APIs
            token_count_response = await model.count_tokens_async(prompt)
            input_tokens = token_count_response.total_tokens

            response = await model.generate_content_async(
                contents=prompt,
                generation_config=config,
            )

            output_text = response.text
            output_token_response = await model.count_tokens_async(output_text)
            output_tokens = output_token_response.total_tokens

            return ProviderResponse(
                content=output_text,
                raw_response=response,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            )
        except Exception as exc:
            logger.error("Gemini execution failure: %s", exc, exc_info=True)
            raise AIProviderServiceException(
                detail=f"Google Gemini request failed for model: {self.model_name}",
                extra_details={"exception": str(exc)},
            ) from exc