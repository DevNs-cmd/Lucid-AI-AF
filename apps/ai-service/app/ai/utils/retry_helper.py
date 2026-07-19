"""Exponential backoff execution wrappers for async tasks."""

import asyncio
import logging
from collections import abc
from typing import Callable, TypeVar

logger = logging.getLogger(__name__)

T = TypeVar("T")


class AsyncRetryHelper:
    """Wraps asynchronous functions with exponential backoff on failure."""

    @staticmethod
    async def execute(
        coroutine_func: Callable[[], abc.Awaitable[T]],
        retries: int = 3,
        backoff_base: float = 2.0,
    ) -> T:
        """Retries an async operation with exponential backoff.

        Args:
            coroutine_func: The asynchronous callable to run.
            retries: Maximum execution attempts allowed.
            backoff_base: Delay factor base multiplier.

        Returns:
            The resolved return value of the async callable.
        """
        attempt = 1
        while True:
            try:
                return await coroutine_func()
            except Exception as exc:
                if attempt > retries:
                    logger.error(
                        "Execution threshold of %d attempts exhausted. Terminating.",
                        retries,
                    )
                    raise exc
                
                delay_duration = backoff_base**attempt
                logger.warning(
                    "Execution failed on attempt %d/%d. Retrying in %ss. Error: %s",
                    attempt,
                    retries,
                    delay_duration,
                    exc,
                )
                await asyncio.sleep(delay_duration)
                attempt += 1