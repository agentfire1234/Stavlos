import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: chats } = await supabaseAdmin
            .from('chats')
            .select('id, title, mode, created_at, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(50)

        return NextResponse.json(chats || [])
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
