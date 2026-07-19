"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCache = void 0;
const redisClient_1 = require("../lib/redisClient");
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
/** Sessions: who's logged in, what world/story they're currently in. */
exports.sessionCache = {
    async set(sessionId, data, ttlSeconds = SESSION_TTL_SECONDS) {
        await redisClient_1.redis.set((0, redisClient_1.key)("session", sessionId), JSON.stringify(data), "EX", ttlSeconds);
    },
    async get(sessionId) {
        const raw = await redisClient_1.redis.get((0, redisClient_1.key)("session", sessionId));
        return raw ? JSON.parse(raw) : null;
    },
    async touch(sessionId, ttlSeconds = SESSION_TTL_SECONDS) {
        await redisClient_1.redis.expire((0, redisClient_1.key)("session", sessionId), ttlSeconds);
    },
    async destroy(sessionId) {
        await redisClient_1.redis.del((0, redisClient_1.key)("session", sessionId));
    },
};
