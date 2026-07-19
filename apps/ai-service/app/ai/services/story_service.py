"""Core dynamic narrative generation coordinator."""

from typing import List
from pydantic import BaseModel, Field
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.prompts.story import StoryPromptTemplates
from app.ai.utils.prompt_builder import PromptBuilder
from app.ai.validation import ResponseValidator


class StoryChapterResponse(BaseModel):
    """Structured chapter generation schema."""

    chapter_title: str = Field(..., description="The title of the generated chapter")
    narrative_passage: str = Field(..., description="The main story text segment")
    suggested_actions: List[str] = Field(..., description="Suggested follow-up choices")


class StoryService:
    """Coordinates generative prompt assemblies and validates output responses."""

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        """Hooks the system-wide execution orchestrator."""
        self.orchestrator = orchestrator

    async def generate_chapter(
        self,
        world_context: str,
        plot_chronology: str,
        player_action: str,
        preferred_model: str = "gpt-4o-mini",
    ) -> StoryChapterResponse:
        """Assembles prompt resources, executes model generation, and returns a verified chapter."""
        prompt = PromptBuilder.build(
            template=StoryPromptTemplates.NARRATIVE_GENERATION,
            variables={
                "world_context": world_context,
                "plot_chronology": plot_chronology,
                "player_action": player_action,
            },
        )

        response = await self.orchestrator.execute(
            preferred_model=preferred_model,
            prompt=prompt,
            system_instruction="You are the system narrator for LUCID AI.",
            temperature=0.75,
        )

        return ResponseValidator.validate_schema(
            raw_content=response.content, target_schema=StoryChapterResponse
        )