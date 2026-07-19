"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.key = key;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
/**
 * Single shared Redis connection for the whole service.
 * Used for: sessions, story cache, memory cache, prompt cache,
 * user state, and rate limiting (per the tech stack doc).
 */
class RedisClient {
    static instance;
    static get() {
        if (!RedisClient.instance) {
            RedisClient.instance = new ioredis_1.default(env_1.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                lazyConnect: false,
            });
            RedisClient.instance.on("error", (err) => {
                console.error("[Redis] connection error:", err.message);
            });
            RedisClient.instance.on("connect", () => {
                console.log("[Redis] connected");
            });
        }
        return RedisClient.instance;
    }
}
exports.redis = RedisClient.get();
/** Namespaces every key with the configured prefix, e.g. "lucid:session:123". */
function key(...parts) {
    return [env_1.env.CACHE_PREFIX, ...parts].join(":");
}
