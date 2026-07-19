"""Database session lifecycle execution factory module for the LUCID AI Backend.

Instantiates asynchronous session configurations and exposes low-level context managers
for non-FastAPI processes (e.g., Celery tasks and automation scripts).
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from app.database.database import async_engine

# High-performance async session generator
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Prevents lazy-loading model attribute failures post-commit
    autocommit=False,
    autoflush=False,
)


@asynccontextmanager
async def get_async_session_context() -> AsyncGenerator[AsyncSession, None]:
    """Retrieves a managed context database session.

    Guarantees automatic rollback of active transactions on exceptions,
    facilitating thread/async safety inside background execution threads.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()