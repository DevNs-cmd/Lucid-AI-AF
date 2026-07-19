"""Security and Cryptography management module for the LUCID AI Backend.

Provides standard JSON Web Token (JWT) manipulation, password hashing algorithms,
and decoupled security dependencies for role and permission authorization.
"""

import logging
from datetime import datetime, timedelta, UTC
from typing import Any
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, Field

from app.config.constants import API_TOKEN_URL
from app.config.settings import settings
from app.core.exceptions import (
    UserAuthenticationException,
    UserAuthorizationException,
)

logger = logging.getLogger(__name__)

# Configure passlib to utilize bcrypt for secure database password storage
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Reusable OAuth2 Bearer token resolution helper
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=API_TOKEN_URL)


class TokenUser(BaseModel):
    """Internal credentials model translated from validated JWT payload claims."""

    id: str = Field(..., description="Database primary identification key of the user")
    email: str = Field(..., description="Primary email identifier of the user")
    role: str = Field(..., description="Configured RBAC structural user execution role")
    scopes: list[str] = Field(
        default_factory=list, description="Explicit array of operational privileges"
    )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password matches its cryptographically hashed representation."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generates a secure, salted bcrypt hash of a plain password string."""
    return pwd_context.hash(password)


def create_access_token(
    subject: str | Any,
    role: str,
    email: str,
    scopes: list[str] | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """Encodes a context-scoped short-lived JWT Access Token payload."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    claims_payload = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "email": email,
        "scopes": scopes or [],
        "type": "access",
    }
    return jwt.encode(
        claims_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )


def create_refresh_token(
    subject: str | Any, expires_delta: timedelta | None = None
) -> str:
    """Encodes a long-lived JWT Refresh Token payload."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(days=7)

    claims_payload = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
    }
    return jwt.encode(
        claims_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )


def verify_token(token: str, expected_type: str = "access") -> dict[str, Any]:
    """Validates the structural and signature integrity of a given JWT token.

    Raises:
        UserAuthenticationException: If signature verification or lifespan validity checks fail.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_type = payload.get("type")
        if token_type != expected_type:
            raise UserAuthenticationException("Invalid token lifecycle context.")
        return payload
    except JWTError as exc:
        logger.warning("JWT token verification failed. Reason: %s", exc)
        raise UserAuthenticationException("Could not validate credentials.") from exc


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenUser:
    """FastAPI Dependency resolving and validating JWT identity tokens to context payload blocks.

    Raises:
        UserAuthenticationException: If claims are malformed or missing key parameters.
    """
    payload = verify_token(token, expected_type="access")

    user_id = payload.get("sub")
    email = payload.get("email")
    role = payload.get("role")
    scopes = payload.get("scopes")

    if not user_id or not email or not role or scopes is None:
        raise UserAuthenticationException(
            "Security identity validation failed. Core token claims missing."
        )

    return TokenUser(id=user_id, email=email, role=role, scopes=scopes)


class RoleChecker:
    """FastAPI Dependency class verifying the caller matches specified RBAC roles."""

    def __init__(self, allowed_roles: list[str]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(
        self, current_user: TokenUser = Depends(get_current_user)
    ) -> TokenUser:
        """Asserts caller role configuration complies with execution authorization parameters."""
        if current_user.role not in self.allowed_roles:
            raise UserAuthorizationException(
                f"Insufficient role clearance. Authorized roles for this endpoint: {self.allowed_roles}."
            )
        return current_user


class PermissionChecker:
    """FastAPI Dependency class enforcing fine-grained system privilege scope checking."""

    def __init__(self, required_scopes: list[str]) -> None:
        self.required_scopes = required_scopes

    def __call__(
        self, current_user: TokenUser = Depends(get_current_user)
    ) -> TokenUser:
        """Asserts identity scopes match required path privilege parameters."""
        user_scopes_set = set(current_user.scopes)
        required_scopes_set = set(self.required_scopes)

        if not required_scopes_set.issubset(user_scopes_set):
            missing_scopes = required_scopes_set - user_scopes_set
            raise UserAuthorizationException(
                f"Insufficient scope clearance. Missing token access privilege: {list(missing_scopes)}."
            )
        return current_user