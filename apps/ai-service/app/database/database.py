"""Engine configuration module for the LUCID AI Backend.

Configures a high-performance SQLAlchemy AsyncEngine optimized for PostgreSQL 17
utilizing asyncpg with production-grade connection pool parameters.
"""

import logging
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Validates database URL is configuration ready
if not settings.DATABASE_URL:
    raise ValueError("Database connection URL (DATABASE_URL) has not been configured.")

# Production-grade async engine tuned for high concurrency and connection recycling
async_engine: AsyncEngine = create_async_engine(
    url=settings.DATABASE_URL,
    pool_size=20,  # Limits standard pool connections
    max_overflow=10,  # Standard overflow fallback threshold during traffic bursts
    pool_timeout=30,  # Exception deadline wait limit in seconds
    pool_recycle=1800,  # Actively recycles idle connections every 30 minutes
    pool_pre_ping=True,  # Actively verifies session connection sanity prior to execution
    echo=settings.DEBUG,
    future=True,
)