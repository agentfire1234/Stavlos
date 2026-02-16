import { supabaseAdmin } from '@/lib/supabase'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getDashboardData(userId: string, email: string) {
    // 1. Get User Profile
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    // 2. Get User Rank & Waitlist Info
    const { data: waitlist } = await supabaseAdmin
        .from('waitlist_with_rank')
        .select('*')
        .eq('email', email)
        .single()

    // 3. Get Today's Usage
    const today = new Date().toISOString().split('T')[0]
    const usageKey = `usage:${userId}:${today}:messages`
    const messagesUsed = parseInt(await redis.get(usageKey) as string || '0')
    const messageLimit = profile?.is_pro ? 100 : 5

    // 4. Get Syllabuses
    const { data: syllabuses } = await supabaseAdmin
        .from('syllabuses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    // 5. Get Recent Chats
    const { data: conversations } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5)

    // 6. Calculate Streak
    const { data: activities } = await supabaseAdmin
        .from('user_activities')
        .select('activity_date')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })

    let streak = 0
    if (activities && activities.length > 0) {
        let checkDate = new Date()
        checkDate.setHours(0, 0, 0, 0)

        for (const activity of activities) {
            const actDate = new Date(activity.activity_date)
            actDate.setHours(0, 0, 0, 0)

            if (actDate.getTime() === checkDate.getTime()) {
                streak++
                checkDate.setDate(checkDate.getDate() - 1)
            } else if (actDate.getTime() > checkDate.getTime()) {
                continue // Skip duplicates if any
            } else {
                break // Gap in streak
            }
        }
    }

    // 7. Get Platform Wide Stats (Total signups)
    const { count: totalSignups } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

    return {
        profile,
        waitlist,
        usage: { used: messagesUsed, limit: messageLimit },
        syllabuses: syllabuses || [],
        conversations: conversations || [],
        streak,
        platform: { totalSignups: totalSignups || 0 }
    }
}
