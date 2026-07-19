"""Updates psychological character affect tracking values."""

from pydantic import BaseModel, Field
from app.ai.ai_orchestrator import AIOrchestrator
from app.ai.prompts.emotion import EmotionPromptTemplates
from app.ai.utils.prompt_builder import PromptBuilder
from app.ai.validation import ResponseValidator


class EmotionAnalysisResponse(BaseModel):
    """Structured emotional analysis schema."""

    dominant_emotion: str = Field(..., description="The dominant emotion of the character")
    valence_shift: float = Field(..., description="Valence scale shift from -1.0 to 1.0")
    arousal_shift: float = Field(..., description="Arousal scale shift from -1.0 to 1.0")
    internal_reaction: str = Field(..., description="Internal narrative reaction description")


class EmotionService:
    """Manages character psychological status updates."""

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        """Hooks execution engine dependency."""
        self.orchestrator = orchestrator

    async def analyze_emotional_shift(
        self,
        character_profile: str,
        narrative_event: str,
        preferred_model: str = "gpt-4o-mini",
    ) -> EmotionAnalysisResponse:
        """Calculates dimensional shifts based on recent story developments."""
        prompt = PromptBuilder.build(
            template=EmotionPromptTemplates.AFFECT_ANALYSIS,
            variables={
                "character_profile": character_profile,
                "narrative_event": narrative_event,
            },
        )

        response = await self.orchestrator.execute(
            preferred_model=preferred_model,
            prompt=prompt,
            system_instruction="You are an emotional tracking engine.",
            temperature=0.3,
        )

        return ResponseValidator.validate_schema(
            raw_content=response.content, target_schema=EmotionAnalysisResponse
        )