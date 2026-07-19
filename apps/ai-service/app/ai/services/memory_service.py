"""Summarizes conversations and manages semantic vector indices."""

from typing import List
from pydantic import BaseModel, Field
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.embedding_service import EmbeddingService
from app.ai.prompts.memory import MemoryPromptTemplates
from app.ai.utils.prompt_builder import PromptBuilder
from app.ai.validation import ResponseValidator


class CondensedMemory(BaseModel):
    """Structured memory consolidation schema."""

    condensed_summary: str = Field(..., description="Condensed summary of the events")
    key_entities: List[str] = Field(..., description="Key characters or items mentioned")
    narrative_importance: float = Field(..., description="Narrative importance score")


class MemoryService:
    """Processes, condenses, and indexes story memories."""

    def __init__(self, orchestrator: AIOrchestrator, embedding_service: EmbeddingService) -> None:
        """Injects core dependency drivers."""
        self.orchestrator = orchestrator
        self.embedding_service = embedding_service

    async def condense_and_index_memory(
        self,
        session_id: str,
        user_id: str,
        raw_interactions: str,
        preferred_model: str = "gpt-4o-mini",
    ) -> CondensedMemory:
        """Assembles condensation prompt steps, indexes, and returns validated condensed memory."""
        prompt = PromptBuilder.build(
            template=MemoryPromptTemplates.CONSOLIDATION,
            variables={"raw_interactions": raw_interactions},
        )

        response = await self.orchestrator.execute(
            preferred_model=preferred_model,
            prompt=prompt,
            system_instruction="You are a data memory consolidation module.",
            temperature=0.3,
        )

        validated_response = ResponseValidator.validate_schema(
            raw_content=response.content, target_schema=CondensedMemory
        )

        # Sync coordinate dimensions inside vector storage
        await self.embedding_service.upsert_vector(
            collection_name="lucid_memories",
            point_id=session_id,
            text=validated_response.condensed_summary,
            payload={
                "user_id": user_id,
                "entities": validated_response.key_entities,
                "importance": validated_response.narrative_importance,
            },
        )

        return validated_response