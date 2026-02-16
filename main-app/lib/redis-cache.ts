import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class RedisCache {
    /**
     * TIER 1: ETERNAL CACHE
     * Used for static definitions, common concepts, and non-changing metadata.
     * TTL: 7 Days
     */
    static async getEternal(key: string) {
        return await redis.get(`eternal:${key}`)
    }

    static async setEternal(key: string, value: any) {
        await redis.set(`eternal:${key}`, JSON.stringify(value), { ex: 604800 })
    }

    /**
     * TIER 2: DAILY CACHE
     * Used for dashboard stats, project lists, and daily usage.
     * TTL: 24 Hours (resets daily)
     */
    static async getDaily(key: string) {
        return await redis.get(`daily:${key}`)
    }

    static async setDaily(key: string, value: any) {
        await redis.set(`daily:${key}`, JSON.stringify(value), { ex: 86400 })
    }

    /**
     * TIER 3: USER CACHE
     * Used for individual user sessions, temporary flags, and rate-limits.
     * TTL: 1 Hour
     */
    static async getUser(userId: string, key: string) {
        return await redis.get(`user:${userId}:${key}`)
    }

    static async setUser(userId: string, key: string, value: any) {
        await redis.set(`user:${userId}:${key}`, JSON.stringify(value), { ex: 3600 })
    }

    /**
     * AI SEMANTIC CACHE (Advanced)
     * Used to avoid duplicate LLM calls for identical prompts.
     */
    static async getAICache(promptHash: string) {
        return await redis.get(`ai:cache:${promptHash}`)
    }

    static async setAICache(promptHash: string, response: string) {
        await redis.set(`ai:cache:${promptHash}`, response, { ex: 86400 * 3 }) // Cache for 3 days
    }
}
