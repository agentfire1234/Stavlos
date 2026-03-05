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

    // Token hash flow: forward to client-side confirm page.
    // The browser client (createBrowserClient) stores the session via document.cookie,
    // which is immediately readable by the middleware on the next navigation.
    if (token_hash && type) {
        const params = new URLSearchParams({ token_hash, type, next })
        return NextResponse.redirect(new URL(`/auth/confirm?${params}`, requestUrl.origin))
    }

    // PKCE code flow: handle server-side
    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
                            )
                        } catch {
                            // In some server contexts cookies cannot be set
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL(next, requestUrl.origin))
        }
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
    }

    return NextResponse.redirect(
        new URL('/login?error=auth_callback_missing_params', requestUrl.origin)
    )
}
