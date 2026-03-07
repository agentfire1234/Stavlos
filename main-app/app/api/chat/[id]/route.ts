import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify ownership
        const { data: chat } = await supabaseAdmin
            .from('chats')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (!chat) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
        }

        // Get messages
        const { data: messages } = await supabaseAdmin
            .from('messages')
            .select('id, role, content, model_used, created_at')
            .eq('chat_id', id)
            .order('created_at', { ascending: true })

        return NextResponse.json({ chat, messages: messages || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
