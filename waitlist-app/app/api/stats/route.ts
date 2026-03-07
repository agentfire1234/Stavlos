import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        const db = supabaseAdmin || supabase
        const { count: totalSignups } = await db
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        const { data: rawLeaderboard } = await db
            .from('waitlist')
            .select('email, referral_count')
            .order('referral_count', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(50)

        const leaderboard = (rawLeaderboard || []).map(u => ({
            referral_count: u.referral_count,
            email: maskEmail(u.email)
        }))

        return NextResponse.json({
            total: totalSignups || 0,
            leaderboard
        })

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}

function maskEmail(email: string): string {
    if (!email) return ''
    const [name, domain] = email.split('@')
    const visible = name.substring(0, 2)
    return `${visible}***@${domain}`
}
