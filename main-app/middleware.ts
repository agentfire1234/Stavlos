import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Iron Dome - Global Kill Switch Check
    // We allow the /admin route and /offline page to be accessed even in maintenance
    const isMaintenancePath =
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname === '/offline' ||
        request.nextUrl.pathname.startsWith('/api/admin') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.') // static files

    if (!isMaintenancePath) {
        try {
            // Using a direct fetch to Redis or a simplified check to avoid heavy dependencies in middleware
            // Since we already have @upstash/redis in the project, we can use it.
            // However, we must ensure it's edge compatible. The 'Redis' class is.
            const { Redis } = await import('@upstash/redis')
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL!,
                token: process.env.UPSTASH_REDIS_REST_TOKEN!,
            })
            const systemStatus = await redis.get('system:config:system_status')

            if (systemStatus === '0') {
                return NextResponse.redirect(new URL('/offline', request.url))
            }
        } catch (e) {
            console.error('Middleware Kill Switch Check Failed:', e)
            // Fail open to avoid blocking the whole site if Redis is down? 
            // Or fail closed for security? Usually best to fail open for UX if it's just a status check.
        }
    }

    // 2. Protected Student Routes
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/chat') ||
        request.nextUrl.pathname.startsWith('/syllabus') ||
        request.nextUrl.pathname.startsWith('/tools') ||
        request.nextUrl.pathname.startsWith('/settings')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 3. Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
        const isAdmin = user && (user.id === adminId || user.email === process.env.ADMIN_EMAIL)
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // 4. Auth Redirect (If logged in, don't show login/signup)
    if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (manifest.json, sw.js, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw|auth/callback|auth/confirm).*)',
    ],
}
