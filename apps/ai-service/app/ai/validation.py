"""Input-output parsing validations, auto-fixing filters, and syntax checks."""

import json
import logging
import re
from typing import Any, Type, TypeVar
from pydantic import BaseModel, ValidationError
from app.core.exceptions import ValidationException

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class ResponseValidator:
    """Validates structural generation schemas against Pydantic models."""

    @staticmethod
    def extract_clean_json(text: str) -> str:
        """Extracts JSON substrings, cleaning markdown fences and trailing lists formatting."""
        sanitized = text.strip()

        # Isolate code blocks from generator wrapper strings
        fenced_block = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", sanitized, re.DOTALL)
        if fenced_block:
            sanitized = fenced_block.group(1)

        # Remove trailing commas in arrays/objects
        sanitized = re.sub(r",\s*([\]}])", r"\1", sanitized)
        return sanitized

    @classmethod
    def validate_schema(cls, raw_content: str, target_schema: Type[T]) -> T:
        """Validates and parses string formats directly into typed Pydantic structures."""
        cleaned_json_string = cls.extract_clean_json(raw_content)
        try:
            raw_dictionary = json.loads(cleaned_json_string)
            return target_schema.model_validate(raw_dictionary)
        except (json.JSONDecodeError, ValidationError) as exc:
            logger.error(
                "JSON Validation Failed. Original payload: %s | Error details: %s",
                raw_content,
                exc,
            )
            raise ValidationException(
                detail="Model response violated expected JSON structural contracts.",
                extra_details={"raw_content": raw_content, "error": str(exc)},
            ) from exc