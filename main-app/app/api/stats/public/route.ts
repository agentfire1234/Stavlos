import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Public stats — no auth required, cached for 60s
export async function GET() {
    try {
        const { count: students } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        const { count: syllabi } = await supabaseAdmin
            .from('syllabuses')
            .select('*', { count: 'exact', head: true })

        return NextResponse.json(
            { students: students || 0, syllabi: syllabi || 0 },
            { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
        )
    } catch {
        return NextResponse.json({ students: 0, syllabi: 0 })
    }
}
