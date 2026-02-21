import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReferralCode, getBadge } from '@/lib/referral'
import { sendWelcomeEmail, sendStatusUnlockEmail } from '@/lib/email'

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

        // Check for duplicate (now case-insensitive because email is already lowercased)
        const { data: existing } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            // BUG 011: Instead of 409, fetch and return existing user for redirection
            const { data: rankedUser } = await supabase
                .from('waitlist_with_rank')
                .select('*')
                .eq('id', existing.id)
                .single()

            const rank = rankedUser?.current_rank || 0
            const badge = getBadge(rank)
            const referralLink = `${process.env.NEXT_PUBLIC_URL}?ref=${rankedUser?.referral_code}`

            return NextResponse.json({
                success: true,
                isExisting: true,
                user: {
                    id: existing.id,
                    email: rankedUser?.email,
                    rank,
                    badge,
                    referralCode: rankedUser?.referral_code,
                    referralLink,
                    referralCount: rankedUser?.referral_count || 0
                }
            })
        }

        // Find referrer if referral code provided
        let referrerId = null
        if (referredBy) {
            const { data: referrer } = await supabase
                .from('waitlist')
                .select('id')
                .eq('referral_code', referredBy)
                .single()

            referrerId = referrer?.id || null
        }

        // Generate unique referral code
        let referralCode = generateReferralCode()
        let codeExists = true

        while (codeExists) {
            const { data } = await supabase
                .from('waitlist')
                .select('id')
                .eq('referral_code', referralCode)
                .single()

            if (!data) {
                codeExists = false
            } else {
                referralCode = generateReferralCode()
            }
        }

        // Insert into waitlist
        // BUG 001 NOTE: Referral count increment should be handled by a
        // Supabase SQL trigger (see schema.sql / Supabase SQL editor) to
        // prevent race conditions. The JS code does NOT manually increment.
        const { data: newUser, error } = await supabase
            .from('waitlist')
            .insert({
                email,   // already normalized
                referral_code: referralCode,
                referred_by: referrerId
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                {
                    error: 'Failed to join waitlist',
                    details: error.message,
                    code: error.code
                },
                { status: 500 }
            )
        }

        // Get rank using view
        const { data: rankedUser } = await supabase
            .from('waitlist_with_rank')
            .select('*')
            .eq('id', newUser.id)
            .single()

        const rank = rankedUser?.current_rank || 0
        const badge = getBadge(rank)
        const referralLink = `${process.env.NEXT_PUBLIC_URL}?ref=${referralCode}`

        // Send welcome email
        await sendWelcomeEmail({ to: email, rank, referralLink })

        // Send status unlock email if applicable
        if (rank <= 2000) {
            await sendStatusUnlockEmail({ to: email, rank, referralLink })
        }

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                rank,
                badge,
                referralCode,
                referralLink,
                referralCount: 0
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
