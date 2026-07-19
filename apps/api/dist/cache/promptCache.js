"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptCache = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redisClient_1 = require("../lib/redisClient");
const PROMPT_TTL_SECONDS = 60 * 30; // 30 min — short-lived, saves cost on repeats/retries
function hashPrompt(prompt, model) {
    return crypto_1.default.createHash("sha256").update(`${model}::${prompt}`).digest("hex");
}
/**
 * Prompt cache: avoids paying for/re-running an AI API call when the
 * exact same prompt (same model) comes in again shortly after —
 * e.g. a client retry, or two users hitting a stock world-gen prompt.
 * Do NOT use this for anything that must be non-deterministic per call
 * (e.g. dialogue meant to vary) — check per use case before wiring in.
 */
exports.promptCache = {
    async get(prompt, model) {
        return redisClient_1.redis.get((0, redisClient_1.key)("prompt", hashPrompt(prompt, model)));
    },
    async set(prompt, model, response, ttlSeconds = PROMPT_TTL_SECONDS) {
        await redisClient_1.redis.set((0, redisClient_1.key)("prompt", hashPrompt(prompt, model)), response, "EX", ttlSeconds);
    },
};
