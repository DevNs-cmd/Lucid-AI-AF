"""Configuration settings module for the LUCID AI Backend.

This module loads, validates, and typed-structures all environment variables
using Pydantic v2 Settings.
"""

from typing import Annotated, Any, Literal
from pydantic import (
    AnyHttpUrl,
    BeforeValidator,
    Field,
    field_validator,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors_origins(v: Any) -> list[str]:
    """Parses CORS origins from a comma-separated string or list.

    Args:
        v: Input data from the environment variable.

    Returns:
        A list of verified CORS origin strings.
    """
    if isinstance(v, str) and not v.startswith("["):
        return [item.strip() for item in v.split(",") if item.strip()]
    if isinstance(v, list):
        return [str(item) for item in v]
    return ["*"]


class Settings(BaseSettings):
    """System-wide validated configuration properties for LUCID AI."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ==========================================================================
    # General Application Settings
    # ==========================================================================
    PROJECT_NAME: str = Field(default="LUCID AI Backend")
    ENVIRONMENT: Literal["development", "staging", "production"] = Field(
        default="development"
    )
    DEBUG: bool = Field(default=False)
    API_V1_STR: str = Field(default="/api/v1")

    # ==========================================================================
    # Security, JWT, and OAuth2 Settings
    # ==========================================================================
    SECRET_KEY: str = Field(
        min_length=32,
        description="Cryptography signature key for encoding and decoding tokens.",
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440)  # 24 Hours
    ALGORITHM: str = Field(default="HS256")
    SECURITY_BCRYPT_ROUNDS: int = Field(default=12)

    # CORS configuration
    BACKEND_CORS_ORIGINS: Annotated[list[str], BeforeValidator(parse_cors_origins)] = Field(
        default=["*"]
    )

    # ==========================================================================
    # Relational Database Settings (PostgreSQL 17)
    # ==========================================================================
    POSTGRES_SERVER: str = Field(default="localhost")
    POSTGRES_PORT: int = Field(default=5432)
    POSTGRES_USER: str = Field(default="lucid_admin")
    POSTGRES_PASSWORD: str = Field(default="lucid_secure_password")
    POSTGRES_DB: str = Field(default="lucid_db")
    DATABASE_URL: str | None = Field(default=None)

    @model_validator(mode="after")
    def assemble_database_url(self) -> "Settings":
        """Builds a verified postgres+asyncpg URL if not explicitly defined."""
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )
        return self

    # ==========================================================================
    # Redis Configuration
    # ==========================================================================
    REDIS_HOST: str = Field(default="localhost")
    REDIS_PORT: int = Field(default=6379)
    REDIS_PASSWORD: str | None = Field(default=None)
    REDIS_URL: str | None = Field(default=None)

    @model_validator(mode="after")
    def assemble_redis_url(self) -> "Settings":
        """Assembles Redis connection URI."""
        if not self.REDIS_URL:
            auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
            self.REDIS_URL = f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/0"
        return self

    # ==========================================================================
    # Broker & Celery Worker Configuration
    # ==========================================================================
    RABBITMQ_HOST: str = Field(default="localhost")
    RABBITMQ_PORT: int = Field(default=5672)
    RABBITMQ_USER: str = Field(default="guest")
    RABBITMQ_PASSWORD: str = Field(default="guest")

    CELERY_BROKER_URL: str | None = Field(default=None)
    CELERY_RESULT_BACKEND: str | None = Field(default=None)

    @model_validator(mode="after")
    def assemble_celery_urls(self) -> "Settings":
        """Calculates internal Celery transport connection parameters."""
        if not self.CELERY_BROKER_URL:
            self.CELERY_BROKER_URL = (
                f"amqp://{self.RABBITMQ_USER}:{self.RABBITMQ_PASSWORD}"
                f"@{self.RABBITMQ_HOST}:{self.RABBITMQ_PORT}//"
            )
        if not self.CELERY_RESULT_BACKEND:
            auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
            self.CELERY_RESULT_BACKEND = (
                f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/1"
            )
        return self

    # ==========================================================================
    # Qdrant Vector DB Configuration
    # ==========================================================================
    QDRANT_HOST: str = Field(default="localhost")
    QDRANT_PORT: int = Field(default=6333)
    QDRANT_API_KEY: str | None = Field(default=None)
    QDRANT_GRPC_PORT: int = Field(default=6334)
    QDRANT_PREFER_GRPC: bool = Field(default=False)

    # ==========================================================================
    # Third-Party AI Engine Configuration
    # ==========================================================================
    OPENAI_API_KEY: str | None = Field(default=None)
    ANTHROPIC_API_KEY: str | None = Field(default=None)
    GEMINI_API_KEY: str | None = Field(default=None)

    OPENAI_ORGANIZATION_ID: str | None = Field(default=None)
    AI_REQUEST_TIMEOUT_SECONDS: float = Field(default=30.0)
    AI_MAX_RETRIES: int = Field(default=3)

    # ==========================================================================
    # Logging, Telemetry, and Metrics Configuration
    # ==========================================================================
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO"
    )
    OTEL_EXPORTER_OTLP_ENDPOINT: str | None = Field(default=None)
    OTEL_SERVICE_NAME: str = Field(default="lucid-ai-service")
    PROMETHEUS_METRICS_PORT: int = Field(default=9090)
    ENABLE_PROMETHEUS_METRICS: bool = Field(default=True)

    # ==========================================================================
    # Rate Limiting Configuration
    # ==========================================================================
    LIMITER_DEFAULT_LIMITS: str = Field(default="60/minute")
    LIMITER_STORAGE_URI: str | None = Field(default=None)

    @model_validator(mode="after")
    def assemble_limiter_storage_uri(self) -> "Settings":
        """Calculates internal Rate Limiter parameters based on Redis settings."""
        if not self.LIMITER_STORAGE_URI:
            self.LIMITER_STORAGE_URI = self.REDIS_URL
        return self


# Instantiate Global Settings Instance
settings = Settings()  # type: ignore