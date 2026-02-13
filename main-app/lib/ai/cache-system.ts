import { Redis } from '@upstash/redis'
import crypto from 'crypto'

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface CacheResult {
    response: string
    source: 'eternal' | 'daily' | 'user'
    cost: number
}

export class CacheSystem {

    // Create deterministic hash for query
    static hashQuery(query: string): string {
        const normalized = query
            .toLowerCase()
            .trim()
            .replace(/[.,!?;:]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')     // Normalize whitespace

        return crypto
            .createHash('sha256')
            .update(normalized)
            .digest('hex')
            .substring(0, 16)         // Short hash is sufficient
    }

    static async get(query: string, userId: string | null = null): Promise<CacheResult | null> {
        const hash = this.hashQuery(query)

        // Tier 1: Eternal Cache (never expires) - Common knowledge
        const eternal = await redis.get(`eternal:${hash}`) as string
        if (eternal) {
            await redis.incr(`eternal:${hash}:hits`)
            return { response: eternal, source: 'eternal', cost: 0 }
        }

        // Tier 2: Daily Cache (24 hours) - Trending topics
        const daily = await redis.get(`daily:${hash}`) as string
        if (daily) {
            await redis.incr(`daily:${hash}:hits`)
            return { response: daily, source: 'daily', cost: 0 }
        }

        // Tier 3: User Cache (7 days) - Personal context
        if (userId) {
            const user = await redis.get(`user:${userId}:${hash}`) as string
            if (user) {
                await redis.incr(`user:${userId}:${hash}:hits`)
                return { response: user, source: 'user', cost: 0 }
            }
        }

        return null
    }

    static async set(query: string, response: string, userId: string | null = null): Promise<void> {
        const hash = this.hashQuery(query)

        // Determine cache tier based on query type
        if (this.isCommonQuestion(query)) {
            // Eternal: Never expires
            await redis.set(`eternal:${hash}`, response)
            await redis.set(`eternal:${hash}:hits`, 0)
        } else if (this.isTrendingTopic(query)) {
            // Daily: Expires in 24 hours
            await redis.setex(`daily:${hash}`, 86400, response)
            await redis.setex(`daily:${hash}:hits`, 86400, 0)
        } else if (userId) {
            // User: Expires in 7 days
            await redis.setex(`user:${userId}:${hash}`, 604800, response)
            await redis.setex(`user:${userId}:${hash}:hits`, 604800, 0)
        }
    }

    static isCommonQuestion(query: string): boolean {
        const patterns = [
            /what is/i,
            /define/i,
            /explain/i,
            /how to/i,
            /difference between/i,
            /meaning of/i
        ]
        return patterns.some(p => p.test(query))
    }

    static isTrendingTopic(query: string): boolean {
        const patterns = [/today/i, /latest/i, /recent/i, /current/i, /news/i]
        return patterns.some(p => p.test(query))
    }

    static async getStats() {
        // This would need a scan or separate counter tracking
        // For demo purposes returning placeholder
        return {
            eternal: { hits: await this.getHits('eternal') },
            daily: { hits: await this.getHits('daily') },
            user: { hits: await this.getHits('user') }
        }
    }

    static async getHits(tier: string): Promise<number> {
        // In a real app, you'd maintain a global counter
        // efficiently, not scan keys.
        return 0
    }
}
