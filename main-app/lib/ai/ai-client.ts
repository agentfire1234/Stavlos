import { OpenAI } from 'openai'

// Using OpenRouter for multi-model fallback and Groq access
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
})

export class AIClient {
    static async chat(query: string, context: string, model: string, taskType: string) {
        // Model routing logic
        const systemPrompt = this.getSystemPrompt(taskType)

        const response = await openrouter.chat.completions.create({
            model: this.mapModel(model),
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: context ? `CONTEXT FROM SYLLABUS:\n${context}\n\nUSER QUESTION: ${query}` : query }
            ]
        })

        return response
    }

    private static mapModel(model: string): string {
        // Map simplified names to OpenRouter actual IDs
        if (model === 'llama-3.1-70b-versatile') return 'meta-llama/llama-3.1-70b-instruct'
        if (model === 'llama-3.1-8b-instant') return 'meta-llama/llama-3.1-8b-instruct'
        return model
    }

    private static getSystemPrompt(taskType: string): string {
        const prompts: Record<string, string> = {
            'grammar_fix': "You are an expert editor. Fix the grammar of the user's input. Only return the corrected text unless they ask for a breakdown.",
            'flashcard': "Generate 3-5 flashcard sets (Front/Back) based on the user's input or course context.",
            'summary': "Summarize the following text or course section into bullet points.",
            'essay_outline': "Create a PEEL structure essay outline (Point, Evidence, Explanation, Link) for the user's topic.",
            'math_solver': "Solve the math problem step by step. Be precise and clear.",
            'syllabus_qa': "You are a study expert using the provided syllabus context. Answer only based on the context if possible.",
            'general_chat': "You are STAVLOS AI, a brilliant and friendly study partner. Help the student master their subjects."
        }
        return prompts[taskType] || prompts['general_chat']
    }
}
