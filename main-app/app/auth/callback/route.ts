import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(actualCode)
        if (!error) {
            // Forward trailing slash / next param
            const forwardedUrl = new URL(next, requestUrl.origin)
            return NextResponse.redirect(forwardedUrl)
        }

        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
    }

    // Fallback for implicit flow (type + token_hash without pkce_ prefix)
    if (token_hash && type) {
        const params = new URLSearchParams({ token_hash, type, next })
        return NextResponse.redirect(new URL(`/auth/confirm?${params}`, requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/login?error=auth_callback_missing_params', requestUrl.origin))
}
