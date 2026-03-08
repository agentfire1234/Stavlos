import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AIOrchestrator } from '@/lib/ai/orchestrator'
import { supabaseAdmin } from '@/lib/supabase'
import { RAGSystem } from '@/lib/ai/rag-system'

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

        await supabaseAdmin
            .from('messages')
            .insert({ chat_id: currentChatId, role: 'user', content: message })

        const taskTypeMap: Record<string, string> = {
            general: 'general_chat',
            syllabus: 'syllabus_qa',
            math: 'math_solver',
            grammar: 'grammar_fix',
            summary: 'summary',
            essay: 'essay_outline',
            flashcards: 'flashcard',
        }
        const taskType = taskTypeMap[mode] || 'general_chat'

        const result = await AIOrchestrator.handleQuery(
            message,
            userId,
            userTier,
            taskType,
            false,
            syllabusId
        )

        if (!result.blocked) {
            let finalResponse = result.response

            // Special handling for flashcards to save them to the DB
            let flashcardSetId = null
            if (taskType === 'flashcard' && result.response) {
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
