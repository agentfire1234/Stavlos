import { OpenAI } from 'openai'

// Initialize OpenRouter Client (Consolidated AI Provider)
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "https://stavlos.com",
        "X-Title": "Stavlos Student OS",
    }
})

export class AIClient {
    static async chat(query: string, context: string, model: string, taskType: string, stream: boolean = false) {
        const primaryModel = model.includes('/') ? model : `meta-llama/${model}`
        const systemPrompt = this.getSystemPrompt(taskType)

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: context ? `CONTEXT FROM SYLLABUS:\n${context}\n\nUSER QUESTION: ${query}` : query }
        ]

        try {
            console.log(`[AI] Attempting ${taskType} with ${primaryModel} via OpenRouter (Stream: ${stream})...`)

            if (stream) {
                return await openrouter.chat.completions.create({
                    model: primaryModel,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 2000,
                    stream: true,
                })
            }

            const response = await openrouter.chat.completions.create({
                model: primaryModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
            })
            return response

        } catch (error: any) {
            console.error(`[AI] OpenRouter Failure (${primaryModel}):`, {
                message: error.message,
                status: error.status,
                details: error.error || error
            })

            // Re-throw with a user-friendly message
            throw new Error(error.status === 401
                ? "AI Authentication failed. Please check system configuration."
                : "AI Service Temporarily Unavailable. Please try again soon.")
        }
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
