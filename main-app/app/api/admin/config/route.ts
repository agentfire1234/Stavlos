import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const BUDGET_KEY = 'system:config:daily_budget_eur';

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

        const { data: configs } = await supabaseAdmin
            .from('system_config')
            .select('*')
            .in('key', ['daily_budget_eur', 'model_overrides', 'kill_switch']);

        return NextResponse.json(configs || []);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
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

        const { key, value } = await req.json();

        // Update Supabase
        const { error } = await supabaseAdmin
            .from('system_config')
            .upsert({ key, value: typeof value === 'string' ? value : JSON.stringify(value), updated_at: new Date().toISOString() });

        if (error) throw error;

        // Update Redis Cache
        const redisKey = `system:config:${key}`;
        await redis.set(redisKey, typeof value === 'string' ? value : JSON.stringify(value));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
