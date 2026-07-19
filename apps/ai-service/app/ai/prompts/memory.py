"""Semantic log summarization and database metadata prompts."""


class MemoryPromptTemplates:
    """Guides summarizing text records before vector indexing operations."""

    CONSOLIDATION = (
        "Extract key developments from the conversation log to store in memory.\n\n"
        "Conversation Logs:\n{raw_interactions}\n\n"
        "Condense events, items, or social developments into a concise format.\n"
        "You must format your output strictly matching the following JSON contract structure:\n"
        "{{\n"
        "  \"condensed_summary\": \"string\",\n"
        "  \"key_entities\": [\"string\"],\n"
        "  \"narrative_importance\": float  // scale: 0.0 (low) to 1.0 (high)\n"
        "}}"
    )