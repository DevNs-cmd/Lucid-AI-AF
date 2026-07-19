"""Manages algorithmic story quest progression blueprints."""

from typing import List
from pydantic import BaseModel, Field
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.prompts.quest import QuestPromptTemplates
from app.ai.utils.prompt_builder import PromptBuilder
from app.ai.validation import ResponseValidator


class DynamicQuestResponse(BaseModel):
    """Structured quest generation schema."""

    quest_name: str = Field(..., description="The title of the generated quest")
    flavor_text: str = Field(..., description="Narrative motivation context")
    difficulty_tier: str = Field(..., description="Calculated quest difficulty tier")
    objectives: List[str] = Field(..., description="Active sequential quest objective list")
    xp_reward: int = Field(..., description="Experience reward for completion")


class QuestService:
    """Manages procedural quest outline generations."""

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        """Hooks execution engine dependency."""
        self.orchestrator = orchestrator

    async def generate_quest(
        self,
        player_stats: str,
        story_arc_state: str,
        preferred_model: str = "gpt-4o-mini",
    ) -> DynamicQuestResponse:
        """Creates quests matched dynamically to character variables and status updates."""
        prompt = PromptBuilder.build(
            template=QuestPromptTemplates.PROCEDURAL_QUEST,
            variables={
                "player_stats": player_stats,
                "story_arc_state": story_arc_state,
            },
        )

        response = await self.orchestrator.execute(
            preferred_model=preferred_model,
            prompt=prompt,
            system_instruction="You are a procedural quest generation system.",
            temperature=0.7,
        )

        return ResponseValidator.validate_schema(
            raw_content=response.content, target_schema=DynamicQuestResponse
        )