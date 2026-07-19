"""Structured exception declarations and API serialization response schemas for the LUCID AI Backend.

Provides standard HTTP status definitions and machine-readable error models to enforce
uniform API communication.
"""

from typing import Any
from fastapi import HTTPException, status
from pydantic import BaseModel, Field


class ErrorResponseDetail(BaseModel):
    """Pydantic model encapsulating specific, machine-parseable details of a system error."""

    code: str = Field(
        ...,
        description="Machine-readable system categorization code (e.g. AUTHENTICATION_FAILED)",
    )
    message: str = Field(
        ..., description="Human-readable description of the error context"
    )
    details: Any | None = Field(
        default=None,
        description="Optional contextual trace or validation payload details",
    )


class GlobalErrorResponse(BaseModel):
    """Unified error response contract structure returned on any system failure."""

    error: ErrorResponseDetail


class LUCIDException(Exception):
    """Core domain parent exception class from which all local library errors inherit."""

    pass


class DatabaseException(LUCIDException):
    """Exception indicating internal database operations or repository layer constraints failed."""

    pass


class AIProviderException(LUCIDException):
    """Exception representing issues encountered inside upstream AI or model inference pipelines."""

    pass


class CustomHTTPException(HTTPException):
    """Unified custom HTTP exception class mapped directly to OpenAPI routing contracts."""

    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str = "SYSTEM_ERROR",
        extra_details: Any | None = None,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.extra_details = extra_details


class UserAuthenticationException(CustomHTTPException):
    """Exception raised when credential proofs are missing, expired, or malformed."""

    def __init__(
        self, detail: str = "Could not validate authentication credentials."
    ) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="AUTHENTICATION_FAILED",
        )


class UserAuthorizationException(CustomHTTPException):
    """Exception raised when authenticated clients lack structural permission scopes or execution roles."""

    def __init__(
        self, detail: str = "Insufficient permissions to execute this request."
    ) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="AUTHORIZATION_DENIED",
        )


class EntityNotFoundException(CustomHTTPException):
    """Exception raised when a requested resource is absent from storage layers."""

    def __init__(self, detail: str = "Requested resource not found.") -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="RESOURCE_NOT_FOUND",
        )


class ValidationException(CustomHTTPException):
    """Exception representing failures inside semantic model assertions or data verification checks."""

    def __init__(
        self,
        detail: str = "Validation failed for request context.",
        extra_details: Any | None = None,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR",
            extra_details=extra_details,
        )


class AIProviderServiceException(CustomHTTPException):
    """Exception mapping upstream LLM/VLM connection timeout errors, usage bans, or API failures."""

    def __init__(
        self,
        detail: str = "Upstream AI model provider API execution failed.",
        extra_details: Any | None = None,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
            error_code="AI_PROVIDER_ERROR",
            extra_details=extra_details,
        )


class DatabaseServiceException(CustomHTTPException):
    """Exception mapping underlying ORM/DB infrastructure lockouts, failures, or crashes."""

    def __init__(
        self,
        detail: str = "Internal database operational error encountered.",
        extra_details: Any | None = None,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            error_code="DATABASE_SERVICE_ERROR",
            extra_details=extra_details,
        )