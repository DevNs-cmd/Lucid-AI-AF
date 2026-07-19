"""Dynamic quest generators matching character level variables."""


class QuestPromptTemplates:
    """Procedurally creates quest objectives scaled to player progression."""

    PROCEDURAL_QUEST = (
        "Design a story quest scaled to the player's progression.\n\n"
        "Player Stats:\n{player_stats}\n\n"
        "Active Story Arc State:\n{story_arc_state}\n\n"
        "Create a quest objective path. You must format your output "
        "strictly matching the following JSON contract structure:\n"
        "{{\n"
        "  \"quest_name\": \"string\",\n"
        "  \"flavor_text\": \"string\",\n"
        "  \"difficulty_tier\": \"string\",\n"
        "  \"objectives\": [\"string\"],\n"
        "  \"xp_reward\": int\n"
        "}}"
    )