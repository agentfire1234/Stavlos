import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AIOrchestrator } from '@/lib/ai/orchestrator'

export async function POST(req: Request) {
    try {
        const { topic, structure = 'PEEL' } = await req.json()
        if (!topic?.trim()) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() } } }
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const prompt = `Create an essay outline about "${topic}" using the ${structure} structure. Include introduction, body paragraphs, and conclusion.`
        const result = await AIOrchestrator.handleQuery(
            prompt,
            user.id,
            'free',
            'essay_outline'
        )

        if (result.blocked) {
            return NextResponse.json({ error: result.message }, { status: 429 })
        }

        return NextResponse.json({ result: result.response, model_used: result.model })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to generate outline' }, { status: 500 })
    }
}
