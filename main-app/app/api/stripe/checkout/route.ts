import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Get User Profile & Waitlist Rank
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('referral_count, email')
            .eq('id', user.id)
            .single()

        // Get rank from waitlist table (bridge between auth email and waitlist)
        const { data: waitlist } = await supabaseAdmin
            .from('waitlist_with_rank')
            .select('current_rank')
            .eq('email', user.email)
            .single()

        // 2. Determine Price Tier & Rewards (Waitlist Promises)
        const { data: waitlistData } = await supabaseAdmin
            .from('waitlist')
            .select('referral_count')
            .eq('email', user.email)
            .single()

        const referrals = waitlistData?.referral_count || profile?.referral_count || 0
        const isTop2000 = (waitlist?.current_rank || 99999) <= 2000

        // Promises:
        // 1. Rank <= 2000 OR 1+ Referral = €5/mo Lock
        // 2. 2+ Referrals = 1st Month Free (30-day trial)
        const isPriceLocked = isTop2000 || referrals >= 1
        const hasFreeTrial = referrals >= 2

        const priceId = isPriceLocked
            ? process.env.STRIPE_PRICE_PRO_FOUNDER
            : process.env.STRIPE_PRICE_PRO_STANDARD

        if (!priceId) {
            console.error('Missing Stripe Price IDs in ENV')
            return NextResponse.json({ error: 'Billing system configuration error' }, { status: 500 })
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer_email: profile?.email || user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            // Apply 30-day trial if 2+ referrals
            subscription_data: hasFreeTrial ? { trial_period_days: 30 } : undefined,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?billing=cancelled`,
            metadata: {
                userId: user.id,
                referralCount: referrals.toString(),
                isPriceLocked: isPriceLocked.toString(),
                hasFreeTrial: hasFreeTrial.toString()
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
