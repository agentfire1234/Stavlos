import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // 1. Fetch all users with ranks
        const { data: users, error: usersError } = await supabase
            .from('waitlist_with_rank')
            .select('*')
            .order('current_rank', { ascending: true })

        if (usersError) throw usersError

        // 2. Aggregate stats
        const { count: totalSignups } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: signupsToday } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())

        return NextResponse.json({
            success: true,
            users: users || [],
            stats: {
                total: totalSignups || 0,
                today: signupsToday || 0,
            }
        })

    } catch (error) {
        console.error('Admin API error:', error)
        return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 })
    }
}
