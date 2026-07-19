"""Semantic coordination driver generating and querying coordinate metrics inside Qdrant."""

import logging
from typing import Any, Dict, List
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams
from app.config.settings import settings
from app.core.exceptions import DatabaseServiceException

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Manages high-throughput semantic vector calculations and search logic."""

    def __init__(self) -> None:
        """Connects to OpenAI's embeddings models and the Qdrant cluster."""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment configuration is missing.")
        
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.qdrant_client = AsyncQdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT,
            api_key=settings.QDRANT_API_KEY,
        )
        self.embedding_model = "text-embedding-3-small"
        self.vector_dimension = 1536

    async def get_embedding(self, text: str) -> List[float]:
        """Calculates coordinate dimensions from a string using OpenAI models."""
        try:
            response = await self.openai_client.embeddings.create(
                input=text, model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as exc:
            logger.error("Failed to generate embedding vector context: %s", exc)
            raise DatabaseServiceException(
                detail="Embedding service failed to process request payload."
            ) from exc

    async def ensure_collection(self, collection_name: str) -> None:
        """Verifies target collection exists inside Qdrant database index layers."""
        try:
            collections = await self.qdrant_client.get_collections()
            collection_names = [col.name for col in collections.collections]

            if collection_name not in collection_names:
                logger.info("Initializing missing vector index collection namespace: %s", collection_name)
                await self.qdrant_client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_dimension, distance=Distance.COSINE
                    ),
                )
        except Exception as exc:
            logger.error("Failed to verify or register Qdrant collection %s: %s", collection_name, exc)
            raise DatabaseServiceException(detail="Vector database connection failed.") from exc

    async def upsert_vector(
        self, collection_name: str, point_id: str, text: str, payload: Dict[str, Any]
    ) -> None:
        """Injects calculated text coordinate dimensions and metadata attributes into Qdrant."""
        await self.ensure_collection(collection_name)
        vector = await self.get_embedding(text)
        payload["raw_text"] = text

        try:
            await self.qdrant_client.upsert(
                collection_name=collection_name,
                points=[
                    PointStruct(
                        id=point_id,
                        vector=vector,
                        payload=payload,
                    )
                ],
            )
            logger.info("Point %s upserted to Qdrant collection %s", point_id, collection_name)
        except Exception as exc:
            logger.error("Qdrant coordinate upsert execution failed: %s", exc)
            raise DatabaseServiceException(detail="Failed to write payload vector data.") from exc

    async def search_similarity(
        self, collection_name: str, query: str, limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Queries Qdrant for semantic coordinates nearest the input context."""
        await self.ensure_collection(collection_name)
        query_vector = await self.get_embedding(query)

        try:
            hits = await self.qdrant_client.search(
                collection_name=collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True,
            )

            return [
                {
                    "id": hit.id,
                    "score": hit.score,
                    "payload": hit.payload,
                }
                for hit in hits
            ]
        except Exception as exc:
            logger.error("Qdrant search query processing failed: %s", exc)
            raise DatabaseServiceException(detail="Failed to complete semantic coordinate search.") from exc