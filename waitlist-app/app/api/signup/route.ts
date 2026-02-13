import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReferralCode, getBadge } from '@/lib/referral'
import { sendWelcomeEmail, sendStatusUnlockEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const { email, referredBy } = await request.json()

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email required' },
                { status: 400 }
            )
        }

        // Check for duplicate
        const { data: existing } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            )
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

        // Insert into waitlist (trigger will handle referral count)
        const { data: newUser, error } = await supabase
            .from('waitlist')
            .insert({
                email,
                referral_code: referralCode,
                referred_by: referrerId
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to join waitlist' },
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
        await sendWelcomeEmail({
            to: email,
            rank,
            referralLink
        })

        // Send status unlock email if applicable
        if (rank <= 2000) {
            await sendStatusUnlockEmail({
                to: email,
                rank,
                referralLink
            })
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
