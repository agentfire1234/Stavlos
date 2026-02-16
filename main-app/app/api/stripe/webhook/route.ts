import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any
            const userId = session.metadata.userId

            if (!userId) {
                console.error('Missing userId in session metadata')
                break
            }

            // Provision Pro Access
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    is_pro: true,
                    stripe_customer_id: session.customer as string,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (error) {
                console.error('Failed to update profile to PRO:', error.message)
            } else {
                console.log(`User ${userId} upgraded to PRO via Stripe.`)
            }
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as any
            // Remove Pro Access (find profile by customer ID)
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({ is_pro: false })
                .eq('stripe_customer_id', subscription.customer as string)

            if (error) console.error('Failed to downgrade user:', error.message)
            break
        }

        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
