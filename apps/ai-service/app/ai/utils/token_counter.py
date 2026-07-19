"""Calculates approximate prompt counts to manage usage limits."""

import logging

logger = logging.getLogger(__name__)


class TokenCounter:
    """Estimates generation token sizes to manage context bounds."""

    @staticmethod
    def estimate_token_size(text: str) -> int:
        """Calculates a clean character-to-token ratio approximation.

        Args:
            text: Target string to analyze.

        Returns:
            Estimated token size counts.
        """
        # Standard structural heuristic: 1 token averages ~4 characters
        return max(1, int(len(text) / 4))