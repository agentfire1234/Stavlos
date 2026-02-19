import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// BUG 008 FIX: Admin route is now fully protected by IP/secret token
// The admin dash requires a secret token in the URL: /admin?token=YOUR_SECRET
// Set ADMIN_SECRET in your .env.local
export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.nextUrl.searchParams.get('token')
        const adminSecret = process.env.ADMIN_SECRET

        if (!adminSecret || token !== adminSecret) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
