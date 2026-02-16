import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // 1. Get Total Count (Real Data)
        const { count: totalSignups } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        // 2. Get Top 50 Leaderboard (Obfuscated)
        const { data: leaderboard } = await supabase
            .from('waitlist')
            .select('email, referral_count')
            .order('referral_count', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(50)

        return NextResponse.json({
            total: totalSignups || 0,
            leaderboard: leaderboard || []
        })

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
