import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CostGovernor } from "@/lib/ai/cost-governor";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Get Live Spend Stats
        const budget = await CostGovernor.checkBudget();

        // 2. Get User Stats
        const { count: totalUsers } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { count: totalSyllabi } = await supabaseAdmin
            .from('syllabuses')
            .select('*', { count: 'exact', head: true });

        // 3. Get Model Usage Stats from Redis
        const today = new Date().toISOString().split('T')[0];
        const models = ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant'];
        let totalCalls = 0;

        for (const model of models) {
            const usage = await redis.get(`usage:${today}:${model}`) as any;
            if (usage) totalCalls += usage.calls;
        }

        // 4. Get Platform Configs (Revenue & Kill Switch)
        const { data: configs } = await supabaseAdmin
            .from('system_config')
            .select('*')
            .in('key', ['platform_revenue_total', 'kill_switch'])

        const revenue = parseFloat(configs?.find(c => c.key === 'platform_revenue_total')?.value || '0')
        const isKillSwitchActive = configs?.find(c => c.key === 'kill_switch')?.value === 'true'
        const estProfit = revenue - budget.spent

        // 5. Get Recent Logs
        const { data: recentLogs } = await supabaseAdmin
            .from('analytics_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        return NextResponse.json({
            ...budget,
            totalUsers: totalUsers || 0,
            totalSyllabi: totalSyllabi || 0,
            totalCalls: totalCalls || 0,
            estProfit: estProfit.toFixed(2),
            revenue: revenue.toFixed(2),
            killSwitch: isKillSwitchActive,
            resetsIn: getResetsIn(),
            recentLogs: recentLogs || []
        })
    } catch (error: any) {
        console.error('Stats error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

function getResetsIn() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(24, 0, 0, 0)
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
}
