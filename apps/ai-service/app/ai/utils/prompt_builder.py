"""Interpolation helper combining templates with active context parameters."""

import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


class PromptBuilder:
    """Assembles prompt strings by interpolating variables into templates."""

    @staticmethod
    def build(template: str, variables: Dict[str, Any]) -> str:
        """Injects values into standard string brackets.

        Args:
            template: The target base prompt layout.
            variables: Parameters to inject into the template.

        Returns:
            The interpolated prompt string.
        """
        try:
            return template.format(**variables)
        except KeyError as exc:
            logger.error(
                "Failed to interpolate prompt variables. Missing key: %s",
                exc,
            )
            raise ValueError(f"Missing required parameter for prompt interpolation: {exc}") from exc