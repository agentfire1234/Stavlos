import { OpenAI } from 'openai'

// Initialize Groq Client (using the OpenAI-compatible endpoint)
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

// Initialize OpenRouter Client
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
    static async chat(query: string, context: string, model: string, taskType: string, stream: boolean = false, history: any[] = []) {
        const systemPrompt = this.getSystemPrompt(taskType)
        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: context ? `CONTEXT FROM SYLLABUS:\n${context}\n\nUSER QUESTION: ${query}` : query }
        ]

        // User's requested primary model
        const GROQ_8B = 'llama-3.1-8b-instant'

        // Determine the models to try in order
        const isGroqModel = model.includes('versatile') || model.includes('instant') || model.includes('8x7b') || (model.includes('70b') && !model.includes('/'));
        const requestedModel = model.includes('/') ? model : (isGroqModel ? model : `meta-llama/${model}`)

        // Always prioritize Groq 8B for reliability, then the originally requested model, then fallbacks
        const modelsToTry = [
            GROQ_8B,
            requestedModel,
            ...FALLBACK_MODELS
        ].filter((m, i, self) => self.indexOf(m) === i)

        let lastError: any = null

        for (const targetModel of modelsToTry) {
            try {
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
                const isRetryable = [401, 404, 408, 429, 500, 502, 503, 504].includes(statusCode)

                console.error(`[AI] Model Failure (${targetModel}): ${error.message} (Status: ${statusCode})`)
                if (!isRetryable) break
                console.log(`[AI] Attempting next fallback model...`)
            }
        }

        console.error(`[AI] Critical Failure: All ${modelsToTry.length} models failed.`)
        throw new Error(lastError?.status === 401
            ? "AI Authentication failed. Please check system configuration."
            : "AI Service Temporarily Unavailable. Please try again soon.")
    }

    private static getSystemPrompt(taskType: string): string {
        const commonInstructions = `
Adapt your communication style to match the user's tone.
If they write short messages, respond short.
If they write casually with typos or slang, be casual back.
If they write formally, be formal.
If they use Dutch, respond in Dutch.
Mirror their energy — don't be stiff when they're relaxed.

If you don't know something or are not confident, 
say so directly. Examples:
- 'I don't know this one.'
- 'Not sure about that, you might want to Google it.'
- 'I can't find this in your syllabus and I'm not 
   confident enough to guess.'
Never make up answers. Never pretend to know something 
you don't.`;

        const prompts: Record<string, string> = {
            'grammar_fix': `You are a grammar fixer. When given any text, immediately return the corrected version. Never ask questions. Never explain unless asked. Just fix it and return the corrected text.${commonInstructions}`,
            'flashcard': `Generate a meaningful flashcard set based on the user's study material. Return ONLY a JSON object with this exact structure: { "title": "A descriptive title for the set", "cards": [ { "front": "Clear specific question", "back": "Concise accurate answer" } ] }. Aim for 5-8 high-quality cards. Do not include any text outside the JSON block.${commonInstructions}`,
            'summary': `You are a summarizer. When given any text, immediately return a clean concise summary in 3-5 sentences as a single paragraph. Never use bullet points. Never ask questions.${commonInstructions}`,
            'essay_outline': `You are an essay outline generator. Return a clean structured outline only. No bullet points for the outline structure itself. Use numbered sections: I. II. III. etc.${commonInstructions}`,
            'math_solver': `You are a math solver. When given any math problem or equation, solve it immediately step by step. Never ask for more information. If x is unknown, solve for x. Show every step clearly numbered. End with 'Answer: [result]'${commonInstructions}`,
            'citation': `You are a citation formatter. Generate a properly formatted citation from the provided source details. For websites: Author/Org. (Year). Title. Retrieved from URL. For books: Author. (Year). Title. Publisher. For journals: Author. (Year). Title. Journal, Volume(Issue), Pages. Return ONLY the formatted citation. Nothing else.${commonInstructions}`,
            'syllabus_qa': `You are a helpful study assistant. If syllabus context is provided, prioritize it and prefix your answer with 'Based on your syllabus:'. If no syllabus context is available, answer from general knowledge and prefix with 'General answer:'. Never say you cannot answer because there is no syllabus. Always give the best answer you can.${commonInstructions}`,
            'conversation_summary': `Summarize this conversation in 3-5 sentences focusing on: what the user is studying, what tasks were completed, and any important context for continuing the conversation. Be concise.`,
            'general_chat': `You are a helpful study assistant. If syllabus context is provided, prioritize it and prefix your answer with 'Based on your syllabus:'. If no syllabus context is available, answer from general knowledge and prefix with 'General answer:'. Never say you cannot answer because there is no syllabus. Always give the best answer you can.${commonInstructions}`
        }
        return prompts[taskType] || prompts['general_chat']
    }
}
