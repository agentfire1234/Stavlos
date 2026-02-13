import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // For now, just allow access
        // In production, you'd check authentication here
        // const session = await getSession(request)
        // if (session?.user?.email !== 'Japonendeutch@gmail.com') {
        //   return NextResponse.redirect(new URL('/', request.url))
        // }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
