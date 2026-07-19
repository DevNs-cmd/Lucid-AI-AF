"""Database injection dependency hooks module for the LUCID AI Backend.

Exposes clean FastAPI-compatible connection lifecycles designed for route executions.
"""

import logging
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import AsyncSessionLocal

logger = logging.getLogger(__name__)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency injection generator yielding active database sessions.

    Assures automatic rollbacks on unhandled HTTP request exceptions and guarantees
    immediate release of connections back to the PG17 connection pool on exit.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as exc:
            logger.error(
                "Unhandled database transaction exception. Forcing session rollback. Reason: %s",
                exc,
                exc_info=True,
            )
            await session.rollback()
            raise
        finally:
            await session.close()