import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { password } = await request.json()
        const adminSecret = process.env.ADMIN_SECRET

        if (!adminSecret) {
            return NextResponse.json({ error: 'Admin secret not configured' }, { status: 500 })
        }

        if (password === adminSecret) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Invalid secret key' }, { status: 401 })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
