"""Dialog structures mapping interactive personality generations."""


class NPCPromptTemplates:
    """Manages role-specific personality profiles for dialog generation."""

    CHARACTER_DIALOG = (
        "Engage in an interactive dialog exchange as the character described below.\n\n"
        "Character Identity Sheet:\n"
        "- Name: {npc_name}\n"
        "- Desires and Motives: {npc_motives}\n"
        "- Distinctive Traits: {npc_traits}\n\n"
        "Contextual Conversation History:\n{dialog_history}\n\n"
        "User Statement:\n{player_statement}\n\n"
        "Generate the response line. You must format your output strictly "
        "matching the following JSON contract structure:\n"
        "{{\n"
        "  \"spoken_line\": \"string\",\n"
        "  \"emotional_affect\": \"string\",\n"
        "  \"subtext_motives\": \"string\"\n"
        "}}"
    )