"""Celery tasks managing asynchronous memory consolidation pipelines."""

import asyncio
import logging
from typing import Any, Dict
from celery import Celery
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.embedding_service import EmbeddingService
from app.ai.services.memory_service import MemoryService
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Configures the Celery application interface pointing to RabbitMQ parameters
celery_app = Celery("lucid_tasks", broker=settings.CELERY_BROKER_URL)
celery_app.conf.update(
    result_backend=settings.CELERY_RESULT_BACKEND,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
)


def run_async_coroutine(coroutine_target: Any) -> Any:
    """Helper running asynchronous coroutines within synchronous worker contexts."""
    return asyncio.get_event_loop().run_until_complete(coroutine_target)


@celery_app.task(name="tasks.condense_session_memory")
def condense_session_memory(
    session_id: str, user_id: str, raw_interactions: str
) -> Dict[str, Any]:
    """Background task condensing user logs and indexing vector coordinates in Qdrant."""
    logger.info("Initializing async memory consolidation pipeline for session: %s", session_id)

    orchestrator = AIOrchestrator()
    embedding_service = EmbeddingService()
    memory_service = MemoryService(
        orchestrator=orchestrator, embedding_service=embedding_service
    )

    try:
        result = run_async_coroutine(
            memory_service.condense_and_index_memory(
                session_id=session_id,
                user_id=user_id,
                raw_interactions=raw_interactions,
            )
        )
        return result.model_dump()
    except Exception as exc:
        logger.error(
            "Background memory indexing operation failed for session %s. Error details: %s",
            session_id,
            exc,
            exc_info=True,
        )
        raise exc