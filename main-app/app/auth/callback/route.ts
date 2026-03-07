import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const allCookies = request.cookies.getAll()
    console.log('CALLBACK COOKIES:', JSON.stringify(allCookies.map(c => c.name)))

    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const response = NextResponse.redirect(
            new URL(next, requestUrl.origin)
        )

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return response
        }

        console.error('Auth callback exchange error:', error.message)
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
    }

    return NextResponse.redirect(
        new URL('/login?error=auth_callback_missing_params', requestUrl.origin)
    )
}
