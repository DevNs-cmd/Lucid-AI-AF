import Redis from "ioredis";
import { env } from "../config/env";

/**
 * Single shared Redis connection for the whole service.
 * Used for: sessions, story cache, memory cache, prompt cache,
 * user state, and rate limiting (per the tech stack doc).
 */
class RedisClient {
  private static instance: Redis;

  static get(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: false,
      });

      RedisClient.instance.on("error", (err: Error) => {
        console.error("[Redis] connection error:", err.message);
      });

      RedisClient.instance.on("connect", () => {
        console.log("[Redis] connected");
      });
    }
    return RedisClient.instance;
  }
}

export const redis = RedisClient.get();

/** Namespaces every key with the configured prefix, e.g. "lucid:session:123". */
export function key(...parts: string[]): string {
  return [env.CACHE_PREFIX, ...parts].join(":");
}
