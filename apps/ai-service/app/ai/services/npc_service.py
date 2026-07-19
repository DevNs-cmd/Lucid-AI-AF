"""Interactive non-player dialog coordinator."""

from pydantic import BaseModel, Field
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.prompts.npc import NPCPromptTemplates
from app.ai.utils.prompt_builder import PromptBuilder
from app.ai.validation import ResponseValidator


class NPCDialogResponse(BaseModel):
    """Structured NPC dialog generation schema."""

    spoken_line: str = Field(..., description="The exact spoken text from the NPC")
    emotional_affect: str = Field(..., description="The physical emotional reaction")
    subtext_motives: str = Field(..., description="The underlying subtext of the conversation")


class NPCService:
    """Handles character roleplay dialog generations."""

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        """Hooks system wide execution orchestrator."""
        self.orchestrator = orchestrator

    async def generate_dialog(
        self,
        npc_name: str,
        npc_motives: str,
        npc_traits: str,
        dialog_history: str,
        player_statement: str,
        preferred_model: str = "gpt-4o-mini",
    ) -> NPCDialogResponse:
        """Builds dialog instructions and returns validated NPC conversational dialog."""
        prompt = PromptBuilder.build(
            template=NPCPromptTemplates.CHARACTER_DIALOG,
            variables={
                "npc_name": npc_name,
                "npc_motives": npc_motives,
                "npc_traits": npc_traits,
                "dialog_history": dialog_history,
                "player_statement": player_statement,
            },
        )

        response = await self.orchestrator.execute(
            preferred_model=preferred_model,
            prompt=prompt,
            system_instruction="Act as a character dialog engine.",
            temperature=0.8,
        )

        return ResponseValidator.validate_schema(
            raw_content=response.content, target_schema=NPCDialogResponse
        )