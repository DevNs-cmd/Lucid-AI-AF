"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMITS = void 0;
exports.rateLimit = rateLimit;
const redisClient_1 = require("../lib/redisClient");
/**
 * Simple fixed-window rate limiter backed by Redis.
 * Use per-user and per-IP to protect AI API routes (the expensive ones)
 * and auth endpoints from abuse.
 */
async function rateLimit(identifier, opts) {
    const k = (0, redisClient_1.key)("ratelimit", identifier);
    const count = await redisClient_1.redis.incr(k);
    if (count === 1) {
        await redisClient_1.redis.expire(k, opts.windowSeconds);
    }
    const ttl = await redisClient_1.redis.ttl(k);
    return {
        allowed: count <= opts.limit,
        remaining: Math.max(0, opts.limit - count),
        resetInSeconds: ttl > 0 ? ttl : opts.windowSeconds,
    };
}
// Preset limits matching the revenue model (Free vs Pro tiers).
exports.RATE_LIMITS = {
    FREE_STORY_GEN_PER_DAY: { limit: 10, windowSeconds: 60 * 60 * 24 }, // "10 chapters/day" (Free)
    PRO_STORY_GEN_PER_DAY: { limit: 1000, windowSeconds: 60 * 60 * 24 }, // effectively unlimited, capped for abuse
    IMAGE_GEN_PER_HOUR: { limit: 20, windowSeconds: 60 * 60 },
    VOICE_GEN_PER_HOUR: { limit: 30, windowSeconds: 60 * 60 },
};
