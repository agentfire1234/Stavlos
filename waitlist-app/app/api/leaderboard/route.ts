import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function maskEmail(email: string) {
    if (!email || !email.includes('@')) return email
    const [username, domain] = email.split('@')
    if (username.length <= 1) return `*@${domain}`
    return `${username.substring(0, Math.min(3, username.length))}***@${domain}`
}

export async function GET() {
    try {
        // Fetch top 10 for leaderboard
        const { data: leaderboard, error } = await supabase
            .from('waitlist')
            .select('email, referral_count')
            .order('referral_count', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(10)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
        }

        const maskedLeaderboard = (leaderboard || []).map((entry: any) => ({
            ...entry,
            email: maskEmail(entry.email)
        }))

        return NextResponse.json({
            success: true,
            leaderboard: maskedLeaderboard
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
