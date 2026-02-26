import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /api/admin routes globally
    if (path.startsWith('/api/admin') && path !== '/api/admin/login') {
        const token = request.cookies.get('admin_token')?.value
        const adminSecret = process.env.ADMIN_SECRET

        if (!adminSecret || token !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/admin/:path*']
}
