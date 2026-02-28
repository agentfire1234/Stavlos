import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateAdminToken } from '@/proxy'

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value
        if (!validateAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        // 1. Fetch all users with ranks
        const { data: users, error: usersError } = await supabaseAdmin!
            .from('waitlist_with_rank')
            .select('*')
            .order('current_rank', { ascending: true })
            .limit(100)

        if (usersError) throw usersError

        // 2. Aggregate stats
        const { count: totalSignups } = await supabaseAdmin!
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: signupsToday } = await supabaseAdmin!
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
