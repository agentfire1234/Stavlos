import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AIOrchestrator } from '@/lib/ai/orchestrator'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const { message, chatId, taskType } = await req.json()

        // 1. Auth Check
        const cookieStore = await cookies()
        const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                },
            }
        )
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = user.id

        // 2. Get User Tier
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_pro')
            .eq('id', userId)
            .single()

        const userTier = profile?.is_pro ? 'pro' : 'free'

        // 3. Persist User Message (Optimistic or Sync)
        let currentChatId = chatId
        if (!currentChatId) {
            const { data: newConvo } = await supabaseAdmin
                .from('conversations')
                .insert({ user_id: userId, title: message.substring(0, 50), preview: message.substring(0, 100) })
                .select()
                .single()
            currentChatId = newConvo?.id
        }

        await supabaseAdmin
            .from('messages')
            .insert({ conversation_id: currentChatId, role: 'user', content: message })

        // 4. Orchestrate
        const result = await AIOrchestrator.handleQuery(
            message,
            userId,
            userTier,
            taskType || 'general_chat'
        )

        // 5. Persist Assistant Message
        if (!result.blocked) {
            await supabaseAdmin
                .from('messages')
                .insert({
                    conversation_id: currentChatId,
                    role: 'assistant',
                    content: result.response,
                    model_used: result.model,
                    cache_hit: result.cacheHit
                })

            // Record activity for streak
            await supabaseAdmin
                .from('user_activities')
                .upsert({ user_id: userId, activity_date: new Date().toISOString().split('T')[0] })
                .select()
        }

        return NextResponse.json({ ...result, chatId: currentChatId })

    } catch (error: any) {
        console.error('Chat error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
