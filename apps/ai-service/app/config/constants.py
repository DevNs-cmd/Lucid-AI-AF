"""System-wide operational constants for the LUCID AI Backend.

Defines standardized parameters for security contexts, AI systems, vector databases,
and internal task worker pipelines.
"""

# ==============================================================================
# Security & Auth Constants
# ==============================================================================
API_TOKEN_URL: str = "/api/v1/auth/login"
AUTHORIZATION_HEADER_KEY: str = "Authorization"
BEARER_TOKEN_PREFIX: str = "Bearer "

# OAuth2 / JWT Scopes Definition
SCOPE_READ_ACCESS: str = "read"
SCOPE_WRITE_ACCESS: str = "write"
SCOPE_ADMIN_ACCESS: str = "admin"

OAUTH2_SCOPES: dict[str, str] = {
    SCOPE_READ_ACCESS: "Grants read access to data endpoints",
    SCOPE_WRITE_ACCESS: "Grants write permissions to modify configurations or datasets",
    SCOPE_ADMIN_ACCESS: "Grants superuser/administrative modifications to application structures",
}

# ==============================================================================
# AI & Embedding Model Constants
# ==============================================================================
# Model Identifiers
MODEL_OPENAI_GPT_4O: str = "gpt-4o"
MODEL_OPENAI_GPT_4O_MINI: str = "gpt-4o-mini"
MODEL_OPENAI_EMBEDDING_3_SMALL: str = "text-embedding-3-small"
MODEL_OPENAI_EMBEDDING_3_LARGE: str = "text-embedding-3-large"

MODEL_ANTHROPIC_CLAUDE_3_5_SONNET: str = "claude-3-5-sonnet-20240620"
MODEL_ANTHROPIC_CLAUDE_3_HAIKU: str = "claude-3-haiku-20240307"

MODEL_GEMINI_1_5_PRO: str = "gemini-1.5-pro"
MODEL_GEMINI_1_5_FLASH: str = "gemini-1.5-flash"

# Embedding Dimensions
EMBEDDING_DIMENSIONS: dict[str, int] = {
    MODEL_OPENAI_EMBEDDING_3_SMALL: 1536,
    MODEL_OPENAI_EMBEDDING_3_LARGE: 3072,
}

# Default Prompt Configurations
SYSTEM_PROMPT_DEFAULT: str = (
    "You are an assistant configured inside the LUCID AI System context."
)
MAX_TOKEN_LIMIT_DEFAULT: int = 4096
AI_DEFAULT_TEMPERATURE: float = 0.7

# ==============================================================================
# Qdrant Collection Constants
# ==============================================================================
QDRANT_DEFAULT_DISTANCE_METRIC: str = "Cosine"
QDRANT_COLLECTION_MEMORIES: str = "lucid_memories"
QDRANT_COLLECTION_DOCUMENTS: str = "lucid_documents"

# ==============================================================================
# Celery Queue Configurations
# ==============================================================================
QUEUE_DEFAULT: str = "lucid_default"
QUEUE_AI_WORKFLOW: str = "lucid_ai_workflow"
QUEUE_LONG_RUNNING: str = "lucid_long_running"

CELERY_TASK_ROUTING: dict[str, str] = {
    "app.workers.tasks.process_document_embedding": QUEUE_AI_WORKFLOW,
    "app.workers.tasks.execute_workflow_chain": QUEUE_AI_WORKFLOW,
    "app.workers.tasks.perform_periodic_maintenance": QUEUE_LONG_RUNNING,
}

# ==============================================================================
# Rate Limiting & API Control
# ==============================================================================
RATE_LIMIT_ANONYMOUS_DEFAULT: str = "20/minute"
RATE_LIMIT_AUTHENTICATED_DEFAULT: str = "120/minute"
RATE_LIMIT_AI_GENERATION: str = "10/minute"

HTTP_HEADER_RATE_LIMIT_LIMIT: str = "X-RateLimit-Limit"
HTTP_HEADER_RATE_LIMIT_REMAINING: str = "X-RateLimit-Remaining"
HTTP_HEADER_RATE_LIMIT_RESET: str = "X-RateLimit-Reset"

# ==============================================================================
# System Metadata Constants
# ==============================================================================
MAX_UPLOAD_SIZE_BYTES: int = 20 * 1024 * 1024  # 20MB Max Upload Constraint
JSON_RESPONSE_CONTENT_TYPE: str = "application/json"