import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: Partial<ResponseCookie> }[]) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Bulletproof Token Hash Flow (Cross-browser safe)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (!error) {
            return NextResponse.redirect(new URL(next, requestUrl.origin))
        } else {
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
            )
        }
    }

    // 2. Legacy PKCE Code Flow (Fails if opened in different browser/device context)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL(next, requestUrl.origin))
        } else {
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
            )
        }
    }

    // No valid token or code found
    return NextResponse.redirect(
        new URL('/login?error=auth_callback_missing_params', requestUrl.origin)
    )
}


