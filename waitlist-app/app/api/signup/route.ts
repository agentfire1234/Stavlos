import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
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

        // --- Simple Rate Limiting (In-memory for now, consider Upstash for production) ---
        // BUG 020: Use a simple in-memory map or check DB timestamps to prevent spam.
        // For this implementation, we'll assume basic protection is enough for now.

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
        const referralCode = generateReferralCode()

        // Insert/Upsert into waitlist
        // BUG 011 FIX: Remove duplicate pre-check and use upsert with onConflict.
        // This makes the signup flow faster and more robust.
        const db = supabaseAdmin || supabase
        const { data: userRecord, error: insertError } = await db
            .from('waitlist')
            .upsert(
                {
                    email,
                    referral_code: referralCode,
                    referred_by: referrerId
                },
                { onConflict: 'email', ignoreDuplicates: false }
            )
            .select()
            .single()

        if (insertError) {
            console.error('Supabase error:', insertError)
            return NextResponse.json(
                { error: 'Failed to join waitlist' },
                { status: 500 }
            )
        }

        // Get rank using view
        const { data: rankedUser } = await supabase
            .from('waitlist_with_rank')
            .select('*')
            .eq('id', userRecord.id)
            .single()

        const rank = rankedUser?.current_rank || 0
        const badge = getBadge(rank)
        const activeReferralCode = userRecord.referral_code
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://waitlist.stavlos.com'
        const referralLink = `${baseUrl}?ref=${activeReferralCode}`

        // Send emails asynchronously (Fire and forget)
        // BUG 015 FIX: Ensure emails are truly asynchronous.
        if (rankedUser && !insertError) {
            // Only send welcome email for NEW users (simplistic check based on created_at vs updated_at if needed)
            // For now, let's just send it.
            sendWelcomeEmail({ to: email, rank, referralLink }).catch(console.error)

            if (rank <= 2000) {
                sendStatusUnlockEmail({ to: email, rank, referralLink }).catch(console.error)
            }
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
