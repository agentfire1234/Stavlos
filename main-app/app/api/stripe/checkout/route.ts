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

        // 2. Determine Price Tier (Minimal Luxury Logic)
        // Base Price: €5 if Top 2000, else €8
        const isTop2000 = (waitlist?.current_rank || 99999) <= 2000

        // Referral: 10% off if 2+ friends
        const hasReferralDiscount = (profile?.referral_count || 0) >= 2

        // Select the correct price ID based on ranking
        // In environmental variables, we should have:
        // STRIPE_PRICE_TOP_2000_DISCOUNTED (Stacking rank + referrals)
        // STRIPE_PRICE_TOP_2000_BASE (Just rank)
        // STRIPE_PRICE_STANDARD_DISCOUNTED (Just referrals)
        // STRIPE_PRICE_STANDARD_BASE (Neither)

        let priceId = process.env.STRIPE_PRICE_PRO_STANDARD

        if (isTop2000) {
            priceId = hasReferralDiscount
                ? process.env.STRIPE_PRICE_TOP_2000_REFERRAL // €4.50 (stacked)
                : process.env.STRIPE_PRICE_TOP_2000_BASE     // €5.00
        } else if (hasReferralDiscount) {
            priceId = process.env.STRIPE_PRICE_PRO_DISCOUNTED // €7.20 (10% off €8)
        }

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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?billing=cancelled`,
            metadata: {
                userId: user.id,
                hasReferralDiscount: hasReferralDiscount.toString()
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
