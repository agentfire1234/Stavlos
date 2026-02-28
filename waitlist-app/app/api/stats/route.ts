import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        const db = supabaseAdmin || supabase
        // 1. Get Total Count (Real Data)
        const { count: totalSignups } = await db
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        // 2. Get Top 50 Leaderboard (Full emails fetched server-side only)
        const { data: rawLeaderboard } = await db
            .from('waitlist')
            .select('email, referral_count')
            .order('referral_count', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(50)

        // BUG 010 FIX: Mask emails on the SERVER before sending to frontend.
        // Raw emails never leave the API layer, so a hacker inspecting the
        // network tab will only see masked values like "ab***@gmail.com".
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
