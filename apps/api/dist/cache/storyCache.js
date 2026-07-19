"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryCache = exports.storyCache = void 0;
const redisClient_1 = require("../lib/redisClient");
const STORY_TTL_SECONDS = 60 * 60 * 6; // 6 hours — hot story state
/**
 * Story cache: holds the "live" state of a user's current chapter/scene
 * so we don't re-hit Postgres on every turn. Source of truth is still
 * the database — this is a fast read-through layer.
 */
exports.storyCache = {
    async setChapterState(storyId, state) {
        await redisClient_1.redis.set((0, redisClient_1.key)("story", storyId, "state"), JSON.stringify(state), "EX", STORY_TTL_SECONDS);
    },
    async getChapterState(storyId) {
        const raw = await redisClient_1.redis.get((0, redisClient_1.key)("story", storyId, "state"));
        return raw ? JSON.parse(raw) : null;
    },
    async invalidate(storyId) {
        await redisClient_1.redis.del((0, redisClient_1.key)("story", storyId, "state"));
    },
};
/**
 * Memory cache: per-character/NPC memory snapshot (recent interactions,
 * relationship deltas) so the Memory AI / NPC AI services can pull it
 * fast without hitting the Vector DB every turn.
 */
exports.memoryCache = {
    async setMemory(npcId, memory, ttlSeconds = STORY_TTL_SECONDS) {
        await redisClient_1.redis.set((0, redisClient_1.key)("memory", npcId), JSON.stringify(memory), "EX", ttlSeconds);
    },
    async getMemory(npcId) {
        const raw = await redisClient_1.redis.get((0, redisClient_1.key)("memory", npcId));
        return raw ? JSON.parse(raw) : null;
    },
    async invalidate(npcId) {
        await redisClient_1.redis.del((0, redisClient_1.key)("memory", npcId));
    },
};
