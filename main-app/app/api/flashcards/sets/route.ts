import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
    try {
        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: sets, error } = await supabaseAdmin
            .from('flashcard_sets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        // Calculate days remaining for each set
        const enhancedSets = (sets || []).map(set => {
            const expiresAt = new Date(set.expires_at)
            const now = new Date()
            const diffTime = expiresAt.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return {
                ...set,
                days_remaining: diffDays > 0 ? diffDays : 0
            }
        })

        return NextResponse.json(enhancedSets)

    } catch (error: any) {
        console.error('List Flashcard Sets Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
