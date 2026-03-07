import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AIOrchestrator } from '@/lib/ai/orchestrator'

export async function POST(req: Request) {
    try {
        const { input, length = 'standard' } = await req.json()
        if (!input?.trim()) {
            return NextResponse.json({ error: 'Input is required' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const prompt = `Summarize this text in a ${length} format:\n\n${input}`
        const result = await AIOrchestrator.handleQuery(
            prompt,
            user.id,
            'free',
            'summary'
        )

        if (result.blocked) {
            return NextResponse.json({ error: result.message }, { status: 429 })
        }

        return NextResponse.json({ result: result.response, model_used: result.model })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to summarize' }, { status: 500 })
    }
}
