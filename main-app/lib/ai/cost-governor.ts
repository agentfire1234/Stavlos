import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Hard budget limit in EUR
const DAILY_BUDGET = parseFloat(process.env.DAILY_BUDGET_EUR || '20')

export type BudgetPhase = 'NORMAL' | 'CAUTIOUS' | 'RESTRICTED' | 'EMERGENCY'

export interface Permission {
    allowed: boolean
    model: string
    queue: boolean
    message: string | null
}

export class CostGovernor {

    static async checkBudget() {
        const today = new Date().toISOString().split('T')[0]
        const spendKey = `spend:${today}`

        // Get current spend
        const todaySpend = parseFloat(await redis.get(spendKey) as string || '0')
        const percentUsed = todaySpend / DAILY_BUDGET

        return {
            spent: todaySpend,
            budget: DAILY_BUDGET,
            remaining: DAILY_BUDGET - todaySpend,
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
                    model: this.getOptimalModel(taskType),
                    message: null
                }

            case 'CAUTIOUS':
                // Force cheaper models where possible
                return {
                    allowed: true,
                    queue: false,
                    model: 'openai/gpt-4o-mini', // Force mini
                    message: null
                }

            case 'RESTRICTED':
                // Queue free users, serve Pro
                if (userTier === 'free') {
                    return {
                        allowed: false,
                        queue: true,
                        model: 'openai/gpt-4o-mini',
                        message: "⚡ High demand! Queued for 1 hour.\n\n💡 Upgrade to Pro for instant responses"
                    }
                }
                return {
                    allowed: true,
                    queue: false,
                    model: 'openai/gpt-4o-mini',
                    message: null
                }

            case 'EMERGENCY':
                // Cache only for free (rejected here), Pro queued
                if (userTier === 'free') {
                    return {
                        allowed: false,
                        queue: false,
                        model: 'openai/gpt-4o-mini',
                        message: "📊 Daily limit reached. Resets at midnight.\n\n⚡ Upgrade to Pro for 24/7 access"
                    }
                }
                return {
                    allowed: true, // Pro still allowed but maybe queued
                    queue: true,
                    model: 'openai/gpt-4o-mini',
                    message: "Queued for priority processing"
                }
        }
    }

    static getOptimalModel(taskType: string): string {
        // Model routing for OpenRouter
        const routing: Record<string, string> = {
            'grammar_fix': 'openai/gpt-4o-mini',
            'flashcard': 'openai/gpt-4o-mini',
            'summary': 'openai/gpt-4o-mini',
            'essay_outline': 'openai/gpt-4o-mini',
            'code_debug': 'openai/gpt-4o-mini',
            'general_chat': 'openai/gpt-4o-mini',
            'math_solver': 'openai/gpt-4o', // Need reasoning power
            'syllabus_qa': 'openai/gpt-4o-mini'
        }

        return routing[taskType] || 'openai/gpt-4o-mini'
    }

    static async recordCost(inputTokens: number, outputTokens: number, model: string): Promise<number> {
        const today = new Date().toISOString().split('T')[0]
        const spendKey = `spend:${today}`

        // OpenRouter Pricing (Approximate)
        const costPer1K: Record<string, number> = {
            'openai/gpt-4o-mini': 0.00015,
            'openai/gpt-4o': 0.005,
            'openai/gpt-4o-large': 0.015,
            'anthropic/claude-3.5-sonnet': 0.003,
            'google/gemini-flash-1.5': 0.000075
        }

        // Fallback to mini price if unknown
        const price = costPer1K[model] || costPer1K['openai/gpt-4o-mini']

        const totalTokens = inputTokens + outputTokens
        const cost = (totalTokens / 1000) * price

        // Atomically increment daily spend
        await redis.incrbyfloat(spendKey, cost)
        await redis.expire(spendKey, 86400 * 2) // Keep for 48h

        // Log detailed usage
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
