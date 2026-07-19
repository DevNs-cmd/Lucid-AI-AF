"""Structured text extracting parsers and auto-cleaners."""

import json
import logging
import re
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class ResponseParser:
    """Extracts JSON segments from unstructured model outputs."""

    @staticmethod
    def extract_json(raw_text: str) -> Optional[Dict[str, Any]]:
        """Finds JSON boundaries in block content, returning a clean dictionary structure."""
        try:
            cleaned = raw_text.strip()
            # Try parsing directly first
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Parse markdown fenced regions
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass

        # Final regex fallback seeking first valid bracket pair
        match_fallback = re.search(r"(\{.*\})", raw_text, re.DOTALL)
        if match_fallback:
            try:
                return json.loads(match_fallback.group(1))
            except json.JSONDecodeError as exc:
                logger.warning("All JSON parsing strategies failed. Error: %s", exc)
        
        return None