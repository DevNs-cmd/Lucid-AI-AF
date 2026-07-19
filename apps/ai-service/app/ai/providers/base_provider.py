"""Abstract base class definition for all AI model providers."""

from abc import ABC, abstractmethod
from typing import Any, List, Optional
from pydantic import BaseModel, Field


class ProviderResponse(BaseModel):
    """Standardized response mapping for all integrated AI providers."""

    content: str = Field(..., description="The generated string output from the model")
    raw_response: Any = Field(None, description="The raw provider-specific response object")
    input_tokens: int = Field(default=0, ge=0, description="The count of input tokens processed")
    output_tokens: int = Field(default=0, ge=0, description="The count of output tokens generated")


class BaseAIProvider(ABC):
    """Interface definition requiring identical generation signatures across providers."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stop_sequences: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> ProviderResponse:
        """Executes a text generation query against the provider's API.

        Args:
            prompt: The user-facing prompt input.
            system_instruction: Core system context instructions.
            temperature: Sampling temperature settings.
            max_tokens: The absolute generation constraint ceiling.
            stop_sequences: Tokens that immediately halt generation.
            **kwargs: Extra vendor-specific hyperparameters.

        Returns:
            ProviderResponse containing the formatted output and token metrics.
        """
        pass