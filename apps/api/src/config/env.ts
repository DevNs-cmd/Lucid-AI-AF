import "dotenv/config";

/**
 * Central place to read env vars. Everything is optional at load time
 * (since API keys arrive later) — individual clients validate the
 * specific key they need right before making a call.
 */
export const env = {
  // AI providers
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || "",
  STABILITY_API_KEY: process.env.STABILITY_API_KEY || "",
  FLUX_API_KEY: process.env.FLUX_API_KEY || "",
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",
  CARTESIA_API_KEY: process.env.CARTESIA_API_KEY || "",
  JINA_API_KEY: process.env.JINA_API_KEY || "",
  OPENAI_MODERATION_MODEL: process.env.OPENAI_MODERATION_MODEL || "omni-moderation-latest",

  STORY_AI_PROVIDER: (process.env.STORY_AI_PROVIDER || "anthropic") as "openai" | "anthropic" | "google",
  IMAGE_AI_PROVIDER: (process.env.IMAGE_AI_PROVIDER || "openai") as "openai" | "stability" | "flux",
  VOICE_AI_PROVIDER: (process.env.VOICE_AI_PROVIDER || "elevenlabs") as "elevenlabs" | "cartesia" | "whisper",
  EMBEDDING_AI_PROVIDER: (process.env.EMBEDDING_AI_PROVIDER || "openai") as "openai" | "jina" | "bge",

  // Payments
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_PRICE_ID_PRO_MONTHLY: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || "",
  STRIPE_PRICE_ID_PRO_YEARLY: process.env.STRIPE_PRICE_ID_PRO_YEARLY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  // Cache
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  CACHE_PREFIX: process.env.CACHE_PREFIX || "lucid",
};

/** Throws a clear, actionable error if a required key isn't set yet. */
export function requireKey(value: string, name: string): string {
  if (!value) {
    throw new Error(
      `[LUCID AI] Missing "${name}". Add it to your .env once the key is issued.`
    );
  }
  return value;
}
