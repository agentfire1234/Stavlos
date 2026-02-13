import { NextResponse } from 'next/server'
import { AIOrchestrator } from '@/lib/ai/orchestrator'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const { message, history, taskType } = await req.json()

        // 1. Auth Check (Placeholder for Supabase Auth)
        // In production: const { data: { user } } = await supabase.auth.getUser()
        // For now, simulate headers or body user_id
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            // Allow anonymous for demo/testing if desired, or block
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get User Tier (Pro vs Free)
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', userId)
            .single()

        const userTier = profile?.is_pro ? 'pro' : 'free'

        // 3. Orchestrate
        const result = await AIOrchestrator.handleQuery(
            message,
            userId,
            userTier,
            taskType || 'general_chat'
        )

        // 4. Return response
        if (result.blocked) {
            return NextResponse.json(result, { status: 429 }) // Too Many Requests
        }

        return NextResponse.json(result)

    } catch (error: any) {
        console.error('Chat error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
