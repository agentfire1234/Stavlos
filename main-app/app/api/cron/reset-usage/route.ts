import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { supabaseAdmin } from '@/lib/supabase'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(req: Request) {
    // 1. Security Check (Vercel Cron Secret)
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateStr = yesterday.toISOString().split('T')[0]

        // 2. Fetch yesterday's stats from Redis
        const spendKey = `spend:${dateStr}`
        const totalSpent = await redis.get(spendKey) as number || 0

        // 3. Persist to Analytics History (Supabase)
        if (totalSpent > 0) {
            await supabaseAdmin.from('daily_analytics').insert({
                date: dateStr,
                total_cost: totalSpent,
                // Add more aggregated metrics here if needed
            })
        }

        // 4. Reset AI Consumption Keys
        // We don't actually delete them, we let them expire via Redis TTL (set to 48h in recordCost)
        // But we ensure the "Current Phase" in Admin UI resets naturally by shifting to the new day's key.

        return NextResponse.json({
            success: true,
            message: `Reset complete for ${dateStr}. Total recorded burn: €${totalSpent.toFixed(4)}`
        })
    } catch (error: any) {
        console.error('CRON RESET ERROR:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
