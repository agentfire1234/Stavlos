import { Redis } from '@upstash/redis'
import { supabaseAdmin } from '@/lib/supabase'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// System config key for budget
const BUDGET_KEY = 'system:config:daily_budget_eur'
const DEFAULT_BUDGET = parseFloat(process.env.DAILY_BUDGET_EUR || '20')

export type BudgetPhase = 'NORMAL' | 'CAUTIOUS' | 'RESTRICTED' | 'EMERGENCY'

export interface Permission {
    allowed: boolean
    model: string
    queue: boolean
    message: string | null
}

export class CostGovernor {

    static async getDailyBudget(): Promise<number> {
        try {
            // 1. Try Redis Cache
            const cached = await redis.get(BUDGET_KEY)
            if (cached) return parseFloat(cached as string)

            // 2. Try Supabase
            const { data } = await supabaseAdmin
                .from('system_config')
                .select('value')
                .eq('key', 'daily_budget_eur')
                .single()

            const budget = data ? parseFloat(data.value) : DEFAULT_BUDGET

            // 3. Cache in Redis for 1 hour
            await redis.set(BUDGET_KEY, budget.toString(), { ex: 3600 })

            return budget
        } catch (e) {
            return DEFAULT_BUDGET
        }
    }

    static async checkBudget() {
        const today = new Date().toISOString().split('T')[0]
        const spendKey = `spend:${today}`
        const budget = await this.getDailyBudget()

        // Get current spend
        const todaySpend = parseFloat(await redis.get(spendKey) as string || '0')
        const percentUsed = todaySpend / budget

        return {
            spent: todaySpend,
            budget: budget,
            remaining: budget - todaySpend,
            percentUsed: percentUsed,
            phase: this.getPhase(percentUsed)
        }
    }

    static getPhase(percentUsed: number): BudgetPhase {
        if (percentUsed < 0.5) return 'NORMAL'      // < 50%
        if (percentUsed < 0.75) return 'CAUTIOUS'   // 50-75%
        if (percentUsed < 0.90) return 'RESTRICTED' // 75-90%
        return 'EMERGENCY'                          // > 90%
    }

    static async shouldProcess(userId: string, userTier: 'free' | 'pro', taskType: string): Promise<Permission> {
        const budget = await this.checkBudget()

        // Smart Degradation Logic
        switch (budget.phase) {
            case 'NORMAL':
                // Everything allowed, optimal models
                return {
                    allowed: true,
                    queue: false,
                    model: await this.getOptimalModel(taskType),
                    message: null
                }

            case 'CAUTIOUS':
                // Force cheaper models where possible
                return {
                    allowed: true,
                    queue: false,
                    model: 'meta-llama/llama-3.1-8b-instruct:free',
                    message: null
                }

            case 'RESTRICTED':
                // Queue free users, serve Pro
                if (userTier === 'free') {
                    return {
                        allowed: false,
                        queue: true,
                        model: 'meta-llama/llama-3.1-8b-instruct:free',
                        message: "⚡ High demand! Queued for 1 hour.\n\n💡 Upgrade to Pro for instant responses"
                    }
                }
                return {
                    allowed: true,
                    queue: false,
                    model: 'llama-3.1-8b-instant',
                    message: null
                }

            case 'EMERGENCY':
                // Cache only for free (rejected here), Pro queued
                if (userTier === 'free') {
                    return {
                        allowed: false,
                        queue: false,
                        model: 'meta-llama/llama-3.1-8b-instruct:free',
                        message: "📊 Daily limit reached. Resets at midnight.\n\n⚡ Upgrade to Pro for 24/7 access"
                    }
                }
                return {
                    allowed: true, // Pro still allowed but maybe queued
                    queue: true,
                    model: 'llama-3.1-8b-instant',
                    message: "Queued for priority processing"
                }
        }
    }

    static async getOptimalModel(taskType: string): Promise<string> {
        // 1. Try to get overrides from Redis
        const overridesStr = await redis.get('system:config:model_overrides') as string
        const overrides = overridesStr ? JSON.parse(overridesStr) : null

        if (overrides && overrides[taskType]) {
            return overrides[taskType]
        }

        // 2. Fallback to hardcoded routing
        const routing: Record<string, string> = {
            'grammar_fix': 'meta-llama/llama-3.1-8b-instruct:free',
            'flashcard': 'meta-llama/llama-3.1-8b-instruct:free',
            'summary': 'meta-llama/llama-3.1-8b-instruct:free',
            'essay_outline': 'meta-llama/llama-3.3-70b-instruct:free',
            'code_debug': 'meta-llama/llama-3.3-70b-instruct:free',
            'general_chat': 'meta-llama/llama-3.3-70b-instruct:free',
            'math_solver': 'meta-llama/llama-3.3-70b-instruct:free',
            'syllabus_qa': 'meta-llama/llama-3.3-70b-instruct:free'
        }

        return routing[taskType] || 'meta-llama/llama-3.3-70b-instruct:free'
    }

    static async recordCost(inputTokens: number, outputTokens: number, model: string, taskType: string = 'chat'): Promise<number> {
        const today = new Date().toISOString().split('T')[0]
        const spendKey = `spend:${today}`

        // Groq Pricing (Approximate)
        const costPer1K: Record<string, number> = {
            'meta-llama/llama-3.3-70b-instruct:free': 0,
            'meta-llama/llama-3.1-8b-instruct:free': 0,
            'google/gemini-2.0-flash-exp:free': 0,
            'mistralai/mistral-small-3.1-24b-instruct:free': 0,
            'openai/text-embedding-3-small': 0.00002
        }

        // Free models cost 0, fallback to 0
        const price = costPer1K[model] ?? 0

        const totalTokens = inputTokens + outputTokens
        const cost = (totalTokens / 1000) * price

        // Atomically increment daily spend
        await redis.incrbyfloat(spendKey, cost)
        await redis.expire(spendKey, 86400 * 2) // Keep for 48h

        // Log to Supabase for persistence
        await supabaseAdmin.from('analytics_logs').insert({
            event_type: taskType === 'chat' ? 'chat' : taskType,
            model_used: model,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            cost: cost,
            cache_hit: false
        })

        // Log detailed usage to Redis for speed
        await this.logUsage(today, model, totalTokens, cost)

        return cost
    }

    static async logUsage(date: string, model: string, tokens: number, cost: number) {
        const logKey = `usage:${date}:${model}`
        const currentStr = await redis.get(logKey) as string
        const current = currentStr
            ? JSON.parse(currentStr)
            : { calls: 0, tokens: 0, cost: 0 }

        const updated = {
            calls: current.calls + 1,
            tokens: current.tokens + tokens,
            cost: current.cost + cost
        }

        await redis.set(logKey, JSON.stringify(updated))
        await redis.expire(logKey, 86400 * 30) // Keep stats for 30 days
    }
}
