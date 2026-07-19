import crypto from "crypto";
import { redis, key } from "../lib/redisClient";

const PROMPT_TTL_SECONDS = 60 * 30; // 30 min — short-lived, saves cost on repeats/retries

function hashPrompt(prompt: string, model: string): string {
  return crypto.createHash("sha256").update(`${model}::${prompt}`).digest("hex");
}

/**
 * Prompt cache: avoids paying for/re-running an AI API call when the
 * exact same prompt (same model) comes in again shortly after —
 * e.g. a client retry, or two users hitting a stock world-gen prompt.
 * Do NOT use this for anything that must be non-deterministic per call
 * (e.g. dialogue meant to vary) — check per use case before wiring in.
 */
export const promptCache = {
  async get(prompt: string, model: string): Promise<string | null> {
    return redis.get(key("prompt", hashPrompt(prompt, model)));
  },

  async set(prompt: string, model: string, response: string, ttlSeconds = PROMPT_TTL_SECONDS) {
    await redis.set(key("prompt", hashPrompt(prompt, model)), response, "EX", ttlSeconds);
  },
};
