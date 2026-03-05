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

        // Explicitly create the redirect response FIRST so the client can append cookies to it.
        const forwardedUrl = new URL(next, requestUrl.origin)
        let response = NextResponse.redirect(forwardedUrl)

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                // Set on the request
                                cookieStore.set(name, value, options)
                                // AND set on the response object
                                response.cookies.set(name, value, options)
                            })
                        } catch {
                            // Ignored
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(actualCode)
        if (!error) {
            return response
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
