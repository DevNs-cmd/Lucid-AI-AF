"""Unit of Work patterns module for the LUCID AI Backend.

Encapsulates database transaction scopes, ensuring clean data mutations across multiple
repositories within consistent transactional context boundaries.
"""

import logging
from types import TracebackType
from typing import Self
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import AsyncSessionLocal

logger = logging.getLogger(__name__)


class SQLAlchemyUnitOfWork:
    """Transactional control context block implementing the Unit of Work (UoW) Pattern.

    Maintains safe transactional context management. Automatically handles rollbacks on
    unexpected exceptions while managing resources with explicit transactional commits.
    """

    def __init__(self, session_factory=AsyncSessionLocal) -> None:
        self.session_factory = session_factory
        self._session: AsyncSession | None = None

    @property
    def session(self) -> AsyncSession:
        """Exposes the active database connection session of this transaction boundary.

        Raises:
            RuntimeError: If accessed outside of an executing async-with block.
        """
        if self._session is None:
            raise RuntimeError(
                "UnitOfWork context is not active. Use within an 'async with' block."
            )
        return self._session

    async def __aenter__(self) -> Self:
        """Instantiates and starts the Unit of Work transaction scope."""
        if self._session is not None:
            raise RuntimeError("Nested UnitOfWork context execution is not permitted.")
        self._session = self.session_factory()
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        """Ends database connection transaction state.

        Rolls back active queries automatically if unhandled exceptions are raised within
        the execution block, protecting database integrity.
        """
        if self._session is None:
            return

        try:
            if exc_type is not None:
                logger.warning(
                    "Automatic rollback executed within UnitOfWork block. Context exception: %s",
                    exc_val,
                )
                await self._session.rollback()
            else:
                await self._session.flush()
        except Exception as teardown_exc:
            logger.error(
                "Database error raised during UnitOfWork exit operations: %s",
                teardown_exc,
                exc_info=True,
            )
            await self._session.rollback()
            raise
        finally:
            await self._session.close()
            self._session = None

    async def commit(self) -> None:
        """Explicitly commits all current transaction operations."""
        if self._session is None:
            raise RuntimeError(
                "No active session found. Cannot commit transaction states."
            )
        try:
            await self._session.commit()
        except Exception as commit_exc:
            logger.error(
                "Failed to commit UnitOfWork transactions. Executing safety rollback. Reason: %s",
                commit_exc,
                exc_info=True,
            )
            await self._session.rollback()
            raise

    async def rollback(self) -> None:
        """Explicitly rolls back all uncommitted operations within the current session."""
        if self._session is None:
            raise RuntimeError(
                "No active session found. Cannot rollback transaction states."
            )
        await self._session.rollback()