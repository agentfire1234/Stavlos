import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AIOrchestrator } from '@/lib/ai/orchestrator'
import { supabaseAdmin } from '@/lib/supabase'
import { RAGSystem } from '@/lib/ai/rag-system'
import { OpenAI } from 'openai'

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req: Request) {
    try {
        const { message, chatId, mode = 'general', syllabusId } = await req.json()

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = user.id

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_pro, daily_usage')
            .eq('id', userId)
            .single()

        const userTier = profile?.is_pro ? 'pro' : 'free'

        let currentChatId = chatId
        if (!currentChatId) {
            const { data: newChat } = await supabaseAdmin
                .from('chats')
                .insert({
                    user_id: userId,
                    title: message.substring(0, 50),
                    mode: mode,
                    syllabus_id: syllabusId || null,
                })
                .select()
                .single()
            currentChatId = newChat?.id
        }

        const { data: currentChat } = await supabaseAdmin
            .from('chats')
            .select('id, summary, syllabus_id, mode')
            .eq('id', currentChatId)
            .single()

        await supabaseAdmin
            .from('messages')
            .insert({ chat_id: currentChatId, role: 'user', content: message })

        // 1. Fetch ALL messages for conversation memory
        const { data: messagesData } = await supabaseAdmin
            .from('messages')
            .select('*')
            .eq('chat_id', currentChatId)
            .order('created_at', { ascending: true })

        const allMessages = messagesData || []

        let history: any[] = []
        let currentSummary = currentChat?.summary || null
        const msgCount = allMessages?.length || 0

        // 2. Sliding Window & Summarization Logic
        if (msgCount > 10) {
            // Check re-summarization thresholds: 20, 40, 80, 160...
            const thresholds = [11, 20, 40, 80, 160, 320, 640]
            const shouldSummarize = !currentSummary || thresholds.includes(msgCount)

            if (shouldSummarize) {
                console.log(`[summarization] Triggered at ${msgCount} messages for chat ${currentChatId}`)
                const toSummarize = allMessages.slice(0, msgCount - 10)
                const summaryText = toSummarize
                    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
                    .join('\n\n')

                try {
                    const { AIClient } = await import('@/lib/ai/ai-client')
                    const summaryResult = await AIClient.chat(
                        `Conversation to summarize:\n\n${summaryText}`,
                        '',
                        'llama-3.1-8b-instant',
                        'conversation_summary'
                    ) as any

                    currentSummary = summaryResult.choices[0].message.content || currentSummary

                    // Save back to DB
                    await supabaseAdmin
                        .from('chats')
                        .update({
                            summary: currentSummary,
                            summary_updated_at: new Date().toISOString()
                        })
                        .eq('id', currentChatId)
                } catch (e) {
                    console.error('Summarization failed:', e)
                }
            }

            // Build history with summary + last 9 previous messages
            if (currentSummary) {
                history.push({ role: 'system', content: `Previous conversation summary: ${currentSummary}` })
            }
            // Take messages from length-10 to length-1 (excluding the current one at index length-1)
            const previousMessages = allMessages.slice(-10, -1).map(m => ({
                role: m.role,
                content: m.content
            }))
            history.push(...previousMessages)
        } else {
            // <= 10 messages: use all except current as history
            history = allMessages.slice(0, -1).map(m => ({
                role: m.role,
                content: m.content
            }))
        }

        const taskTypeMap: Record<string, string> = {
            general: 'general_chat',
            syllabus: 'syllabus_qa',
            math: 'math_solver',
            grammar: 'grammar_fix',
            summary: 'summary',
            essay: 'essay_outline',
            flashcards: 'flashcard',
        }
        let taskType = taskTypeMap[mode] || 'general_chat'

        // AI Intent Classification for Flashcards
        try {
            const classificationResponse = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                max_tokens: 10,
                messages: [
                    {
                        role: 'system',
                        content: `You are an intent classifier. Reply with ONLY one word:
FLASHCARD if the user is explicitly asking YOU to create 
or generate a new set of flashcards for them right now.
NORMAL for everything else including questions about 
flashcards, questions about how flashcards work, or 
any message that does not directly request creation.
No explanation. No punctuation. Just one word.

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
you don't.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })

            const intent = classificationResponse.choices[0].message.content?.trim().toUpperCase()
            if (intent === 'FLASHCARD') {
                console.log(`[intent] AI detected FLASHCARD request for message: "${message.substring(0, 50)}..."`)
                taskType = 'flashcard'
            }
        } catch (e) {
            console.error('Intent classification failed, falling back to mode-based detection:', e)
        }

        const result = await AIOrchestrator.handleQuery(
            message,
            userId,
            userTier,
            taskType,
            false,
            syllabusId || currentChat?.syllabus_id,
            history
        )

        if (!result.blocked) {
            let finalResponse = result.response

            // Special handling for flashcards to save them to the DB (handles remakes/casual requests)
            let flashcardSetId = null
            if (result.response && (taskType === 'flashcard' || result.response.includes('"cards":'))) {
                try {
                    const { parseFlashcardJSON } = await import('@/lib/ai/flashcard-engine')
                    const flashcardData = parseFlashcardJSON(result.response)

                    if (flashcardData && flashcardData.cards.length > 0) {
                        // Save to DB
                        const { data: newSet } = await supabaseAdmin
                            .from('flashcard_sets')
                            .insert({
                                user_id: userId,
                                title: flashcardData.title || 'Chat Flashcards',
                                source: 'chat',
                                card_count: flashcardData.cards.length
                            })
                            .select()
                            .single()

                        if (newSet) {
                            flashcardSetId = newSet.id
                            const cardsToInsert = flashcardData.cards.map((c: any, index: number) => ({
                                set_id: newSet.id,
                                front: c.front,
                                back: c.back,
                                card_index: index
                            }))

                            await supabaseAdmin.from('flashcards').insert(cardsToInsert)

                            // Replace JSON in response with a friendly message + UI trigger
                            finalResponse = `I've generated a set of ${flashcardData.cards.length} flashcards for you: **${flashcardData.title}**. You can start practicing them right now!\n\n[FLASHCARD_SET:${newSet.id}]`
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse/save chat flashcards:', e)
                }
            }

            await supabaseAdmin
                .from('messages')
                .insert({
                    chat_id: currentChatId,
                    role: 'assistant',
                    content: finalResponse,
                    model_used: result.model,
                })

            // Update daily usage
            await supabaseAdmin
                .from('profiles')
                .update({ daily_usage: (profile?.daily_usage || 0) + 1 })
                .eq('id', userId)

            return NextResponse.json({
                response: finalResponse,
                chatId: currentChatId,
                model: result.model,
                blocked: false,
                flashcardSetId
            })
        }

    } catch (error: any) {
        console.error('Chat error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
