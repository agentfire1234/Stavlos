import { CostGovernor } from './cost-governor'
import { CacheSystem } from './cache-system'
import { RAGSystem } from './rag-system'
import { AIClient } from './ai-client'

export interface OrchestratorResult {
    response?: string
    stream?: any
    model: string
    cacheHit: boolean
    cost: number
    blocked?: boolean
    message?: string
    steps: string[]
    sources?: any[]
}

export class AIOrchestrator {
    static async handleQuery(
        query: string,
        userId: string,
        userTier: 'free' | 'pro' = 'free',
        taskType: string = 'general_chat',
        stream: boolean = false,
        syllabusId?: string,
        history: any[] = []
    ): Promise<OrchestratorResult> {
        const steps: string[] = []

        const killStatus = await CacheSystem.getConfig('system_status')
        if (killStatus === '0') {
            return {
                response: 'System is currently undergoing essential maintenance. Please try again shortly.',
                model: 'emergency-offline',
                cacheHit: false,
                cost: 0,
                blocked: true,
                message: 'SYSTEM_OFFLINE',
                steps: ['Checking platform status...', 'Emergency maintenance detected.']
            }
        }

        steps.push("Searching platform knowledge...")
        const cached = await CacheSystem.get(query, userId)
        if (cached && cached.response) {
            steps.push("Found in internal knowledge cache.")
            return {
                response: cached.response,
                model: 'cache-eternal',
                cacheHit: true,
                cost: 0,
                steps
            }
        }

        steps.push("Checking resource availability...")
        const allowed = await CostGovernor.shouldProcess(userId, userTier, taskType)
        if (!allowed.allowed) {
            return {
                model: allowed.model,
                cacheHit: false,
                cost: 0,
                blocked: true,
                message: allowed.message || 'Limit reached',
                steps
            }
        }
        steps.push(`Routing to ${allowed.model.includes('70b') ? 'High-Performance Engine' : 'Instant Engine'}...`)

        let context = ''
        let sources: any[] = []
        if (taskType === 'syllabus_qa' || query.toLowerCase().includes('syllabus')) {
            steps.push("Consulting course syllabuses...")
            const ragResult = await RAGSystem.querySyllabus(query, syllabusId || '', userId)
            if (ragResult.found) {
                context = ragResult.context || ''
                sources = ragResult.ids || []
                steps.push(`Found relevant context in ${sources.length} matching sections.`)
            } else {
                steps.push("No direct course context found. Using global knowledge.")
            }
        }

        steps.push(stream ? "Initializing secure stream..." : "Synthesizing response...")
        const aiResponse = await AIClient.chat(query, context, allowed.model, taskType, stream, history)

        if (stream) {
            return {
                stream: aiResponse,
                model: allowed.model,
                cacheHit: false,
                cost: 0,
                steps,
                sources: sources.length > 0 ? sources : undefined
            }
        }

        const completion = aiResponse as any
        const responseText = completion.choices[0].message.content || ''

        const cost = await CostGovernor.recordCost(
            completion.usage?.prompt_tokens || 0,
            completion.usage?.completion_tokens || 0,
            allowed.model,
            taskType
        )

        if (responseText.length > 50) {
            await CacheSystem.set(query, responseText, userId)
        }

        return {
            response: responseText,
            model: allowed.model,
            cacheHit: false,
            cost: cost,
            steps,
            sources: sources.length > 0 ? sources : undefined
        }
    }
}
