import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    let token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    // Sometimes Supabase emails use ?token_hash=pkce_... instead of ?code=...
    const actualCode = code || (token_hash?.startsWith('pkce_') ? token_hash : null)

    if (actualCode) {
        const supabase = await createClient()
        const forwardedUrl = new URL(next, requestUrl.origin)
        let response = NextResponse.redirect(forwardedUrl)

        const { error } = await supabase.auth.exchangeCodeForSession(actualCode)
        if (!error) {
            return response
        }

        console.error('Auth callback exchange error:', error.message)
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
    }

    // Fallback for implicit flow (type + token_hash without pkce_ prefix)
    if (token_hash && type) {
        const params = new URLSearchParams({ token_hash, type, next })
        return NextResponse.redirect(new URL(`/auth/confirm?${params}`, requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/login?error=auth_callback_missing_params', requestUrl.origin))
}
