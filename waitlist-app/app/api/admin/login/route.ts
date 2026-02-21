import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        const adminSecret = process.env.ADMIN_SECRET

        if (!adminSecret) {
            return NextResponse.json({ error: 'Admin secret not configured' }, { status: 500 })
        }

        // Basic check: Password must match. 
        // In a real app, we'd also check if the email is in an 'authorized_admins' list.
        if (password === adminSecret) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Invalid email or secret key' }, { status: 401 })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
