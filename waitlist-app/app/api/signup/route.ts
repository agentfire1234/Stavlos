import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { generateReferralCode, getBadge } from '@/lib/referral'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const { email: rawEmail, referredBy: rawRef } = await request.json()

        // BUG 007 FIX: Normalize email to lowercase before any processing.
        // A@b.com and a@b.com are treated as the same user.
        const email = rawEmail?.trim().toLowerCase()

        // BUG 009 FIX: Trim referral codes from URLs — they often carry
        // trailing spaces or %20 characters that silently break lookups.
        const referredBy = rawRef?.trim().replace(/%20/g, '')

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email required' },
                { status: 400 }
            )
        }

        // --- Simple Rate Limiting (In-memory for now, consider Upstash for production) ---
        // BUG 020: Use a simple in-memory map or check DB timestamps to prevent spam.
        // For this implementation, we'll assume basic protection is enough for now.

        // Race-condition proof signup
        const db = supabaseAdmin || supabase

        // Find referrer if referral code provided
        let referrerId = null
        if (referredBy) {
            const { data: referrer } = await db
                .from('waitlist')
                .select('id')
                .eq('referral_code', referredBy)
                .maybeSingle()

            referrerId = referrer?.id || null
        }

        // 1. Try to insert first
        const referralCode = generateReferralCode()
        const { data: newUser, error: insertError } = await db
            .from('waitlist')
            .insert({
                email,
                referral_code: referralCode,
                referred_by: referrerId
            })
            .select()
            .maybeSingle()

        let userRecord = newUser
        let isNewUser = !!newUser

        // 2. If insert fails due to duplicate email, fetch existing user instead
        if (insertError || !newUser) {
            const { data: existingUser } = await db
                .from('waitlist')
                .select('*')
                .eq('email', email)
                .maybeSingle()

            if (existingUser) {
                userRecord = existingUser
                isNewUser = false
            } else {
                // Real error occurred
                console.error('Signup error:', insertError)
                return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
            }
        }

        // 3. Get rank using view
        const { data: rankedUser } = await db
            .from('waitlist_with_rank')
            .select('*')
            .eq('id', userRecord.id)
            .single()

        const rank = rankedUser?.current_rank || 0
        const badge = getBadge(rank)
        const activeReferralCode = userRecord.referral_code
        const referralLink = `https://waitlist.stavlos.com?ref=${activeReferralCode}`

        // 4. Send email ONLY for new users (Unified Dynamic Template)
        if (isNewUser && rankedUser) {
            sendWelcomeEmail({ to: email, rank, referralLink }).catch(console.error)
        }

        return NextResponse.json({
            success: true,
            user: {
                id: userRecord.id,
                email: userRecord.email,
                rank,
                badge,
                referralCode: activeReferralCode,
                referralLink,
                referralCount: rankedUser?.referral_count || 0
            }
        })

    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
