import { supabaseAdmin } from '@/lib/supabase'

export async function getDashboardData(userId: string) {
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    const { data: syllabuses } = await supabaseAdmin
        .from('syllabuses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    const { data: flashcards } = await supabaseAdmin
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(4)

    const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5)

    // Query messages sent by user in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Using a RPC or raw query would be better, but we can aggregate from chats/messages
    // For the tracker, we just need to know if there's a message on each day of this week
    const { data: weeklyActivity } = await supabaseAdmin
        .from('messages')
        .select('created_at')
        .eq('role', 'user')
        .gte('created_at', sevenDaysAgo.toISOString())
    // Join with chats to ensure it's this user's messages
    // Since messages doesn't have user_id, we need to filter by chat_id
    // This is a bit complex with standard supabase client if we don't have user_id on messages
    // But we can fetch chat_ids first

    const chatIds = (await supabaseAdmin.from('chats').select('id').eq('user_id', userId)).data?.map(c => c.id) || []

    const { data: recentMessages } = await supabaseAdmin
        .from('messages')
        .select('created_at')
        .in('chat_id', chatIds)
        .eq('role', 'user')
        .gte('created_at', sevenDaysAgo.toISOString())

    const { count: dueCount } = await supabaseAdmin
        .from('flashcard_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_at', new Date().toISOString())

    return {
        profile,
        usage: {
            used: profile?.daily_usage || 0,
            limit: profile?.is_pro ? 500 : 10,
            reset_at: profile?.usage_reset_at
        },
        syllabuses: syllabuses || [],
        chats: chats || [],
        flashcards: flashcards || [],
        dueCount: dueCount || 0,
        streak: profile?.study_streak || 0,
        totalQuestions: profile?.total_questions || 0,
        weeklyActivity: recentMessages?.map(m => new Date(m.created_at).toISOString().split('T')[0]) || []
    }
}
