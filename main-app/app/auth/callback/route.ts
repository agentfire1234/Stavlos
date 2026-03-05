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

    const redirectTo = new URL(next, requestUrl.origin)
    const loginError = (msg: string) =>
        NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(msg)}`, requestUrl.origin))

    // Build the response first so we can attach cookies to it
    let response = NextResponse.redirect(redirectTo)

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    // Set cookies on BOTH the request (for this handler) and the response (so the browser gets them)
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.redirect(redirectTo)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Token Hash Flow (used by our email template)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) return loginError(error.message)
        return response
    }

    // 2. PKCE Code Flow (fallback)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return loginError(error.message)
        return response
    }

    return loginError('auth_callback_missing_params')
}
