import { OpenAI } from 'openai'

// Initialize Groq Client (Speed + Low Cost)
const groq = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
})

// Initialize OpenRouter Client (Backup + Specialized Models)
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "https://stavlos.com",
        "X-Title": "Stavlos Student OS",
    }
})

export class AIClient {
    static async chat(query: string, context: string, model: string, taskType: string) {
        // 1. Determine Primary & Fallback Clients based on Task
        let primary = groq
        let secondary = openrouter
        let primaryModel = model // e.g. 'llama-3.1-70b-versatile' (Groq ID)
        let secondaryModel = this.mapToOpenRouter(model) // e.g. 'meta-llama/llama-3.1-70b-instruct'

        // SPECIAL RULE: Syllabus QA prefers OpenRouter for better context handling/reliability
        if (taskType === 'syllabus_qa') {
            primary = openrouter
            secondary = groq
            primaryModel = this.mapToOpenRouter(model)
            secondaryModel = model
        }

        const systemPrompt = this.getSystemPrompt(taskType)
        const messages: any[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: context ? `CONTEXT FROM SYLLABUS:\n${context}\n\nUSER QUESTION: ${query}` : query }
        ]

        try {
            // 2. ATTEMPT PRIMARY
            console.log(`[AI] Attempting ${taskType} with ${primary === groq ? 'GROQ' : 'OPENROUTER'}...`)
            const response = await primary.chat.completions.create({
                model: primaryModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            })
            return response

        } catch (error: any) {
            // 3. FALLBACK HANDLER
            console.warn(`[AI] Primary failed (${error.message}). Switching to Fallback...`)

            try {
                const response = await secondary.chat.completions.create({
                    model: secondaryModel,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                })
                return response
            } catch (fallbackError: any) {
                console.error(`[AI] Critical Failure: Both providers failed.`, fallbackError)
                throw new Error("AI Service Unavailable. Please try again later.")
            }
        }
    }

    private static mapToOpenRouter(groqModel: string): string {
        // Map Groq IDs to OpenRouter IDs
        // Groq: llama-3.1-70b-versatile -> OR: meta-llama/llama-3.1-70b-instruct
        if (groqModel.includes('70b')) return 'meta-llama/llama-3.1-70b-instruct'
        if (groqModel.includes('8b')) return 'meta-llama/llama-3.1-8b-instruct'
        return 'meta-llama/llama-3.1-70b-instruct' // Default fallback
    }

    private static getSystemPrompt(taskType: string): string {
        const prompts: Record<string, string> = {
            'grammar_fix': "You are an expert editor. Fix the grammar of the user's input. Only return the corrected text unless they ask for a breakdown.",
            'flashcard': "Generate 3-5 flashcard sets (Front/Back) based on the user's input or course context. Format as JSON if possible or clear text.",
            'summary': "Summarize the following text or course section into concise bullet points.",
            'essay_outline': "Create a PEEL structure essay outline (Point, Evidence, Explanation, Link) for the user's topic.",
            'math_solver': "Solve the math problem step by step. Be precise and clear. Use LaTeX formatting for equations if needed.",
            'syllabus_qa': "You are a study expert using the provided syllabus context. Answer strictly based on the syllabus content. If the answer isn't in the context, say so.",
            'general_chat': "You are STAVLOS AI, a brilliant and friendly study partner. Help the student master their subjects. Be concise and encouraging."
        }
        return prompts[taskType] || prompts['general_chat']
    }
}
