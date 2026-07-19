import { redis, key } from "../lib/redisClient";

const STORY_TTL_SECONDS = 60 * 60 * 6; // 6 hours — hot story state

/**
 * Story cache: holds the "live" state of a user's current chapter/scene
 * so we don't re-hit Postgres on every turn. Source of truth is still
 * the database — this is a fast read-through layer.
 */
export const storyCache = {
  async setChapterState(storyId: string, state: unknown) {
    await redis.set(key("story", storyId, "state"), JSON.stringify(state), "EX", STORY_TTL_SECONDS);
  },

  async getChapterState<T = unknown>(storyId: string): Promise<T | null> {
    const raw = await redis.get(key("story", storyId, "state"));
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async invalidate(storyId: string) {
    await redis.del(key("story", storyId, "state"));
  },
};

/**
 * Memory cache: per-character/NPC memory snapshot (recent interactions,
 * relationship deltas) so the Memory AI / NPC AI services can pull it
 * fast without hitting the Vector DB every turn.
 */
export const memoryCache = {
  async setMemory(npcId: string, memory: unknown, ttlSeconds = STORY_TTL_SECONDS) {
    await redis.set(key("memory", npcId), JSON.stringify(memory), "EX", ttlSeconds);
  },

  async getMemory<T = unknown>(npcId: string): Promise<T | null> {
    const raw = await redis.get(key("memory", npcId));
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async invalidate(npcId: string) {
    await redis.del(key("memory", npcId));
  },
};
