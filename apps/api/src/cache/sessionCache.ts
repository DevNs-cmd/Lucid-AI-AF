import { redis, key } from "../lib/redisClient";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionData {
  userId: string;
  email?: string;
  currentWorldId?: string;
  currentStoryId?: string;
  [k: string]: unknown;
}

/** Sessions: who's logged in, what world/story they're currently in. */
export const sessionCache = {
  async set(sessionId: string, data: SessionData, ttlSeconds = SESSION_TTL_SECONDS) {
    await redis.set(key("session", sessionId), JSON.stringify(data), "EX", ttlSeconds);
  },

  async get(sessionId: string): Promise<SessionData | null> {
    const raw = await redis.get(key("session", sessionId));
    return raw ? JSON.parse(raw) : null;
  },

  async touch(sessionId: string, ttlSeconds = SESSION_TTL_SECONDS) {
    await redis.expire(key("session", sessionId), ttlSeconds);
  },

  async destroy(sessionId: string) {
    await redis.del(key("session", sessionId));
  },
};
