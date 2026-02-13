import { CostGovernor } from './cost-governor'
import { CacheSystem } from './cache-system'
import { RAGSystem } from './rag-system'
import OpenAI from 'openai'

// OpenRouter setup (uses OpenAI SDK)
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL,
        "X-Title": "Stavlos"
    }
})

export interface AIResult {
    response: string
    source: 'cache' | 'ai' | 'rag' | 'system'
    model?: string
    cost: number
    cached: boolean
    blocked?: boolean
}

export class AIOrchestrator {

    static async handleQuery(query: string, userId: string, userTier: 'free' | 'pro', taskType: string = 'general_chat'): Promise<AIResult> {

        // STEP 1: Check cache FIRST (always)
        const cached = await CacheSystem.get(query, userId)
        if (cached) {
            return {
                response: cached.response,
                source: 'cache',
                cost: 0,
                cached: true
            }
        }

        // STEP 2: Check budget (smart degradation)
        const permission = await CostGovernor.shouldProcess(userId, userTier, taskType)

        if (!permission.allowed) {
            // Logic for queuing could go here, for now return blocked message
            return {
                response: permission.message || "Request blocked by system policy.",
                source: 'system',
                cost: 0,
                cached: false,
                blocked: true
            }
        }

        // STEP 3: Handle syllabus queries with RAG
        if (taskType === 'syllabus_qa') {
            return await this.handleSyllabusQuery(query, userId, permission.model)
        }

        // STEP 4: Call AI with appropriate model
        const result = await this.callAI(query, permission.model, taskType)

        // STEP 5: Cache the response
        await CacheSystem.set(query, result.response, userId)

        // STEP 6: Record cost
        await CostGovernor.recordCost(
            result.usage.prompt_tokens,
            result.usage.completion_tokens,
            permission.model
        )

        return {
            response: result.response,
            source: 'ai',
            model: permission.model,
            cost: result.cost,
            cached: false
        }
    }

    // RAG handler
    static async handleSyllabusQuery(question: string, userId: string, model: string): Promise<AIResult> {
        const ragResult = await RAGSystem.querySyllabus(question, userId)

        if (!ragResult.found) {
            // Fallback to general chat if not found in syllabus?
            // For now, return the RAG message
            return {
                response: ragResult.message || "Information not found in syllabus.",
                source: 'rag',
                cost: 0.00001, // Minimal cost for embedding
                cached: false
            }
        }

        // Generate answer with context
        const context = ragResult.context
        const systemPrompt = `You are a helpful study assistant. Answer the question based ONLY on the provided syllabus context. If the answer is not in the context, say so.`
        const prompt = `Context:\n${context}\n\nQuestion: ${question}`

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.5
        })

        const responseText = completion.choices[0].message.content || "No response generated."

        // Cache the result
        await CacheSystem.set(question, responseText, userId)

        // Record cost (embedding + generation)
        // Approximate embedding cost + generation cost
        const genCost = this.calculateCost(completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }, model)
        const totalCost = genCost + 0.00001

        await CostGovernor.recordCost(
            (completion.usage?.prompt_tokens || 0),
            (completion.usage?.completion_tokens || 0),
            model
        )

        return {
            response: responseText,
            source: 'rag',
            model: model,
            cost: totalCost,
            cached: false
        }
    }

    // OpenRouter API call
    static async callAI(query: string, model: string, taskType: string) {
        const systemPrompt = this.getSystemPrompt(taskType)
        const maxTokens = this.getMaxTokens(taskType)

        const completion = await openai.chat.completions.create({
            model: model, // OpenRouter model name
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            max_tokens: maxTokens,
            temperature: 0.7
        })

        return {
            response: completion.choices[0].message.content || "No response.",
            usage: completion.usage || { prompt_tokens: 0, completion_tokens: 0 },
            cost: this.calculateCost(completion.usage || { prompt_tokens: 0, completion_tokens: 0 }, model)
        }
    }

    // System prompts (compressed for cost savings)
    static getSystemPrompt(taskType: string): string {
        const prompts: Record<string, string> = {
            'grammar_fix': 'Fix grammar. Be brief.',
            'flashcard': 'Create Q&A flashcards from the text.',
            'summary': 'Summarize efficiently. Key points only.',
            'essay_outline': 'Create an essay outline using PEEL method.',
            'math_solver': 'Solve step-by-step. Explain reasoning.',
            'code_debug': 'Find the bug and explain the fix.',
            'general_chat': 'You are Stavlos, an AI study partner. Help students learn. Be clear and encouraging.',
            'syllabus_qa': 'Answer based on the syllabus context.'
        }

        return prompts[taskType] || prompts['general_chat']
    }

    // Token limits (control costs)
    static getMaxTokens(taskType: string): number {
        const limits: Record<string, number> = {
            'grammar_fix': 150,
            'flashcard': 300,
            'summary': 250,
            'essay_outline': 400,
            'math_solver': 500,
            'code_debug': 400,
            'general_chat': 300
        }

        return limits[taskType] || 200
    }

    // Cost calculation (OpenRouter pricing)
    static calculateCost(usage: { prompt_tokens: number, completion_tokens: number }, model: string): number {
        const costPer1K: Record<string, number> = {
            'openai/gpt-4o-mini': 0.00015,
            'openai/gpt-4o': 0.005, // Blended input/output approx
            'openai/gpt-4o-large': 0.015,
            'anthropic/claude-3.5-sonnet': 0.003,
            'google/gemini-flash-1.5': 0.000075
        }

        const total = usage.prompt_tokens + usage.completion_tokens
        const price = costPer1K[model] || costPer1K['openai/gpt-4o-mini']
        return (total / 1000) * price
    }
}
