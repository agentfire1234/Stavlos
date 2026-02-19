import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        // TODO: Add admin authentication check
        // For now, this will be protected by middleware

        const { data, error } = await supabase
            .from('waitlist_with_rank')
            .select('email, current_rank, referral_count, created_at')
            .order('current_rank', { ascending: true })

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch waitlist data' },
                { status: 500 }
            )
        }

        // Convert to CSV
        const headers = ['Email', 'Rank', 'Referrals', 'Signup Date']
        const rows = (data as any[]).map((user: any) => [
            user.email,
            user.current_rank,
            user.referral_count,
            new Date(user.created_at).toISOString().split('T')[0]
        ])

        const csv = [
            headers.join(','),
            ...rows.map((row: string[]) => row.join(','))
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=waitlist-export.csv'
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
