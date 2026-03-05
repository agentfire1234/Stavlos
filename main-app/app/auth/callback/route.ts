import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    let code = requestUrl.searchParams.get('code')
    let token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    // In PKCE flow, Supabase still populates {{ .TokenHash }} with the PKCE code.
    // If the email template forces "?token_hash={{.TokenHash}}", detect the "pkce_" 
    // prefix and correctly treat it as an authorization code.
    if (token_hash && token_hash.startsWith('pkce_')) {
        code = token_hash
        token_hash = null
    }

    // Token hash flow: forward to client-side confirm page
    if (token_hash && type) {
        const params = new URLSearchParams({ token_hash, type, next })
        return NextResponse.redirect(new URL(`/auth/confirm?${params}`, requestUrl.origin))
    }

    // PKCE code flow: forward to client-side confirm page for reliable cookie storage
    if (code) {
        const params = new URLSearchParams({ code, next })
        return NextResponse.redirect(new URL(`/auth/confirm?${params}`, requestUrl.origin))
    }

    return NextResponse.redirect(
        new URL('/login?error=auth_callback_missing_params', requestUrl.origin)
    )
}

