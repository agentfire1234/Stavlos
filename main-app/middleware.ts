import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { supabase, user, supabaseResponse } = await updateSession(request)

    let response = supabaseResponse

    const isMaintenancePath =
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname === '/offline' ||
        request.nextUrl.pathname.startsWith('/api/admin') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.') // static files

    if (!isMaintenancePath) {
        try {
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
        }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/chat') ||
        request.nextUrl.pathname.startsWith('/syllabus') ||
        request.nextUrl.pathname.startsWith('/tools') ||
        request.nextUrl.pathname.startsWith('/settings')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
        const isAdmin = user && (user.id === adminId || user.email === process.env.ADMIN_EMAIL)
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

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
