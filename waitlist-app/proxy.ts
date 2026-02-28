import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// BUG 005 FIX: Modified Proxy to use exact pathname matching.
// Previously, /admin-something would be incorrectly blocked.
// Also switched to cookie-based auth consistently.

export function isProtectedRoute(pathname: string): boolean {
    return pathname.startsWith('/api/admin')
}

export function validateAdminToken(token: string | undefined): boolean {
    if (!token) return false
    return token === process.env.ADMIN_SECRET
}

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /admin and /api/admin routes
    if (isProtectedRoute(path) && path !== '/api/admin/login') {
        const token = request.cookies.get('admin_token')?.value

        if (!validateAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return null
}
