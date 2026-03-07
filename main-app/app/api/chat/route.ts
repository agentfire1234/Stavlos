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

        let context = ''
        if (mode === 'syllabus' && syllabusId) {
            try {
                const rag = await RAGSystem.querySyllabus(message, userId)
                if (rag.found) context = rag.context
            } catch {
                // RAG failure is non-fatal, continue without context
            }
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
        const taskType = taskTypeMap[mode] || 'general_chat'

        const result = await AIOrchestrator.handleQuery(
            context ? `Context:\n${context}\n\nQuestion: ${message}` : message,
            userId,
            userTier,
            taskType
        )

        if (!result.blocked) {
            await supabaseAdmin
                .from('messages')
                .insert({
                    chat_id: currentChatId,
                    role: 'assistant',
                    content: result.response,
                    model_used: result.model,
                })

            // Update daily usage
            await supabaseAdmin
                .from('profiles')
                .update({ daily_usage: (profile?.daily_usage || 0) + 1 })
                .eq('id', userId)
        }

        return NextResponse.json({
            response: result.response,
            chatId: currentChatId,
            model: result.model,
            blocked: result.blocked || false,
            message: result.message || null,
        })

    } catch (error: any) {
        console.error('Chat error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
