"""Orchestrator class managing model routing, load-balancing, and fallbacks."""

import asyncio
import logging
from typing import Any, Dict, List, Optional
from app.ai.providers.base_provider import ProviderResponse
from app.ai.utils.provider_factory import ProviderFactory
from app.core.exceptions import AIProviderServiceException

logger = logging.getLogger(__name__)


class AIOrchestrator:
    """Manages robust prompt executions across fallback routing structures."""

    def __init__(self) -> None:
        """Configures base resilient fallback routes across model backends."""
        # Configured priority failover chain matching standard model keys
        self.fallback_chains: Dict[str, List[str]] = {
            "gpt-4o-mini": ["claude-3-haiku", "gemini-flash"],
            "gpt-4o": ["claude-3-5-sonnet", "gemini-pro"],
            "claude-3-haiku": ["gpt-4o-mini", "gemini-flash"],
            "claude-3-5-sonnet": ["gpt-4o", "gemini-pro"],
            "gemini-flash": ["gpt-4o-mini", "claude-3-haiku"],
            "gemini-pro": ["gpt-4o", "claude-3-5-sonnet"],
        }

    async def execute(
        self,
        preferred_model: str,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stop_sequences: Optional[List[str]] = None,
        enable_fallback: bool = True,
        **kwargs: Any,
    ) -> ProviderResponse:
        """Routes execution to active backends, failing over dynamically if errors occur."""
        execution_chain = [preferred_model]
        if enable_fallback:
            execution_chain.extend(self.fallback_chains.get(preferred_model, []))

        last_exception: Optional[Exception] = None

        for model_key in execution_chain:
            try:
                logger.info("Routing prompt execution to resolved backend model: %s", model_key)
                provider = ProviderFactory.get_provider(model_key)
                
                return await provider.generate(
                    prompt=prompt,
                    system_instruction=system_instruction,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stop_sequences=stop_sequences,
                    **kwargs,
                )
            except Exception as exc:
                logger.warning(
                    "Model execution failed for route %s. Error: %s",
                    model_key,
                    exc,
                )
                last_exception = exc
                if not enable_fallback:
                    break
                await asyncio.sleep(0.5)  # Quick pause before retry routing

        raise AIProviderServiceException(
            detail="All orchestrated model providers in the execution fallback chain failed.",
            extra_details={"last_error": str(last_exception)},
        )