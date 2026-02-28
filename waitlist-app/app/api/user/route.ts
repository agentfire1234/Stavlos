import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getBadge } from '@/lib/referral'

function maskEmail(email: string) {
    if (!email || !email.includes('@')) return email
    const [username, domain] = email.split('@')
    if (username.length <= 3) return `${username[0]}***@${domain}`
    return `${username.substring(0, 3)}***@${domain}`
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const code = searchParams.get('code')

    if (!email && !code) {
        return NextResponse.json({ error: 'Email or code required' }, { status: 400 })
    }

    try {
        let query = supabase.from('waitlist_with_rank').select('*')

        if (code) {
            query = query.eq('referral_code', code)
        } else {
            query = query.eq('email', email!.trim().toLowerCase())
        }

        const { data: user, error } = await query.single()

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

        const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://waitlist.stavlos.com'
        const referralLink = `${baseUrl}?ref=${user.referral_code}`

        const maskedLeaderboard = (leaderboard || []).map((entry: any) => ({
            ...entry,
            email: maskEmail(entry.email)
        }))

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: maskEmail(user.email),
                rank: user.current_rank,
                referralCount: user.referral_count,
                referralLink,
            },
            leaderboard: maskedLeaderboard
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
