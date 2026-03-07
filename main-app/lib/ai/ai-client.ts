import { OpenAI } from 'openai'
import Groq from 'groq-sdk'

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

// Initialize OpenRouter Client (Consolidated AI Provider)
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "https://stavlos.com",
        "X-Title": "Stavlos Student OS",
    }
})

const FALLBACK_MODELS = [
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free'
]

export class AIClient {
    static async chat(query: string, context: string, model: string, taskType: string, stream: boolean = false) {
        const systemPrompt = this.getSystemPrompt(taskType)
        const messages: any[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: context ? `CONTEXT FROM SYLLABUS:\n${context}\n\nUSER QUESTION: ${query}` : query }
        ]

        // Determine if this is a Groq model or OpenRouter model
        // Groq models usually look like: llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768
        const isGroqModel = model.includes('versatile') || model.includes('instant') || model.includes('8x7b') || model.includes('70b') && !model.includes('/');

        // Create a list of models/providers to try
        const requestedModel = model.includes('/') ? model : (isGroqModel ? model : `meta-llama/${model}`)

        const modelsToTry = [
            requestedModel,
            ...FALLBACK_MODELS.filter(m => m !== requestedModel)
        ]

        let lastError: any = null

        for (const targetModel of modelsToTry) {
            try {
                // Determine provider based on model ID
                // If it contains a slash, it's OpenRouter. If not, it's likely Groq.
                const provider = targetModel.includes('/') ? 'OpenRouter' : 'Groq'

                console.log(`[AI] Attempting ${taskType} with ${targetModel} via ${provider} (Stream: ${stream})...`)

                if (provider === 'Groq') {
                    if (stream) {
                        return await groq.chat.completions.create({
                            model: targetModel,
                            messages: messages,
                            temperature: 0.7,
                            max_tokens: 2000,
                            stream: true,
                        })
                    }

                    const response = await groq.chat.completions.create({
                        model: targetModel,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000,
                    })
                    return response
                } else {
                    // OpenRouter
                    if (stream) {
                        return await openrouter.chat.completions.create({
                            model: targetModel,
                            messages: messages,
                            temperature: 0.7,
                            max_tokens: 2000,
                            stream: true,
                        })
                    }

                    const response = await openrouter.chat.completions.create({
                        model: targetModel,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000,
                    })

                    if (targetModel !== modelsToTry[0]) {
                        console.log(`[AI] Resilience Success: Recovered using ${targetModel} after primary failure.`)
                    }

                    return response
                }

            } catch (error: any) {
                lastError = error
                const statusCode = error.status || 500
                // 401: Unauthorized, 404: Not Found, 429: Rate Limit, 5xx: Server Errors
                const isRetryable = [401, 404, 408, 429, 500, 502, 503, 504].includes(statusCode)

                console.error(`[AI] Model Failure (${targetModel}): ${error.message} (Status: ${statusCode})`)

                if (!isRetryable) {
                    break // Non-retryable error, don't bother trying other models
                }

                console.log(`[AI] Attempting next fallback model...`)
            }
        }

        // If we get here, all models failed
        console.error(`[AI] Critical Failure: All ${modelsToTry.length} models failed.`)

        throw new Error(lastError?.status === 401
            ? "AI Authentication failed. Please check system configuration."
            : "AI Service Temporarily Unavailable. Please try again soon.")
    }

    private static getSystemPrompt(taskType: string): string {
        const prompts: Record<string, string> = {
            'grammar_fix': "You are an expert editor. Fix the grammar of the user's input. Only return the corrected text unless they ask for a breakdown.",
            'flashcard': "Generate 3-5 flashcard sets (Front/Back) based on the user's input or course context. Format as clear text.",
            'summary': "Summarize the following text or course section into concise bullet points.",
            'essay_outline': "Create a PEEL structure essay outline (Point, Evidence, Explanation, Link) for the user's topic.",
            'math_solver': "Solve the math problem step by step. Be precise and clear. Use LaTeX formatting for equations if needed.",
            'syllabus_qa': "You are a study expert using the provided syllabus context. Answer strictly based on the syllabus content. If the answer isn't in the context, say so.",
            'general_chat': "You are STAVLOS AI, a brilliant and friendly study partner. Help the student master their subjects. Be concise and encouraging."
        }
        return prompts[taskType] || prompts['general_chat']
    }
}
