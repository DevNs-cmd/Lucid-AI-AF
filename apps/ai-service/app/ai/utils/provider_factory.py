"""Factory dynamically instantiating specific driver modules."""

from typing import Dict, Type
from app.ai.providers.base_provider import BaseAIProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.anthropic_provider import AnthropicProvider
from app.ai.providers.gemini_provider import GeminiProvider


class ProviderFactory:
    """Resolves specific provider class instances matching requested models."""

    _mappings: Dict[str, Type[BaseAIProvider]] = {
        "gpt-4o-mini": OpenAIProvider,
        "gpt-4o": OpenAIProvider,
        "claude-3-haiku": AnthropicProvider,
        "claude-3-5-sonnet": AnthropicProvider,
        "gemini-flash": GeminiProvider,
        "gemini-pro": GeminiProvider,
    }

    @classmethod
    def get_provider(cls, model_key: str) -> BaseAIProvider:
        """Instantiates and returns the provider driver mapped to the key.

        Args:
            model_key: Identifier key mapping class drivers.

        Returns:
            An active BaseAIProvider implementation.
        """
        provider_class = cls._mappings.get(model_key)
        if not provider_class:
            raise ValueError(f"No configured provider class mapping resolved for key: {model_key}")
        
        # Instantiate matching the specific signature config
        if provider_class == OpenAIProvider:
            model_name = "gpt-4o" if model_key == "gpt-4o" else "gpt-4o-mini"
            return OpenAIProvider(model_name=model_name)
        elif provider_class == AnthropicProvider:
            model_name = "claude-3-5-sonnet-20240620" if model_key == "claude-3-5-sonnet" else "claude-3-haiku-20240307"
            return AnthropicProvider(model_name=model_name)
        else:
            model_name = "gemini-1.5-pro" if model_key == "gemini-pro" else "gemini-1.5-flash"
            return GeminiProvider(model_name=model_name)