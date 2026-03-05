import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    // Collect every cookie Supabase wants to set — we'll attach them to the redirect response
    const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] = []

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    // Don't set yet — collect and apply to response after auth
                    cookiesToSet.forEach(({ name, value, options }) => {
                        pendingCookies.push({ name, value, options: (options ?? {}) as Record<string, unknown> })
                    })
                },
            },
        }
    )

    const loginError = (msg: string) =>
        NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(msg)}`, requestUrl.origin))

    // 1. Token Hash Flow (used by our email template)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) return loginError(error.message)
    }
    // 2. PKCE Code Flow (fallback)
    else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return loginError(error.message)
    }
    else {
        return loginError('auth_callback_missing_params')
    }

    // Build the redirect and stamp every session cookie onto it
    const response = NextResponse.redirect(new URL(next, requestUrl.origin))
    pendingCookies.forEach(({ name, value, options }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.cookies.set(name, value, options as any)
    })

    return response
}
