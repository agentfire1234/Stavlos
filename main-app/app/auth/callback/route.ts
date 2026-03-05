import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

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

