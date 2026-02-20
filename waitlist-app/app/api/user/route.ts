import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getBadge } from '@/lib/referral'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    try {
        // Fetch user with rank
        const { data: user, error } = await supabase
            .from('waitlist_with_rank')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .single()

        if (error || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fetch top 10 for leaderboard
        const { data: leaderboard } = await supabase
            .from('waitlist')
            .select('email, referral_count')
            .order('referral_count', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(10)

        const referralLink = `${process.env.NEXT_PUBLIC_URL}?ref=${user.referral_code}`

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                rank: user.current_rank,
                referralCount: user.referral_count,
                referralLink,
            },
            leaderboard: leaderboard || []
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
