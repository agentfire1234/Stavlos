import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { generateReferralCode, getBadge } from '@/lib/referral'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const { email: rawEmail, referredBy: rawRef } = await request.json()

        const email = rawEmail?.trim().toLowerCase()
        const referredBy = rawRef?.trim().replace(/%20/g, '')

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email required' },
                { status: 400 }
            )
        }



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


        const { data: rankedUser } = await db
            .from('waitlist_with_rank')
            .select('*')
            .eq('id', userRecord.id)
            .single()

        const rank = rankedUser?.current_rank || 0
        const badge = getBadge(rank)
        const activeReferralCode = userRecord.referral_code
        const referralLink = `https://waitlist.stavlos.com?ref=${activeReferralCode}`


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
