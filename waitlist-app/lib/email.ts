import { Resend } from 'resend'
import { getBadge } from './referral'

// Use a safe fallback for build time. Runtime will fail if key is missing, which is expected.
const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

interface WelcomeEmailParams {
    to: string
    rank: number
    referralLink: string
}

const FROM_EMAIL = process.env.NEXT_PUBLIC_EMAIL_SENDER || 'Abraham at Stavlos <abraham@stavlos.com>'

export async function sendWelcomeEmail({ to, rank, referralLink }: WelcomeEmailParams) {
    const badge = getBadge(rank)

    const subject = `You're #${rank} in line`

    const text = `Hey!

Welcome to Stavlos. You're officially on the waitlist. Thanks for joining and helping me.

Your current rank: #${rank}
Your status: ${badge.title}

🎁 Want to lock in the €5 price forever?
Just get 1 friend to join using your link:
${referralLink}

Refer 2 friends and your first month is completely FREE!

I'm Abraham, 14, building this for students like us.
Launch is June 2026.

Stay tuned.
— Abraham
Founder, Stavlos

P.S. Top 2,000 get €5/mo instead of €8/mo. You're ${rank <= 2000 ? 'set!' : 'close!'}`

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            text
        })
    } catch (error) {
        console.error('Failed to send welcome email:', error)
    }
}

interface StatusUnlockEmailParams {
    to: string
    rank: number
    referralLink: string
}

export async function sendStatusUnlockEmail({ to, rank, referralLink }: StatusUnlockEmailParams) {
    let subject = ''
    let text = ''

    if (rank <= 100) {
        subject = 'FOUNDING MEMBER Status Unlocked'
        text = `Wow.

You're #${rank}. That makes you a FOUNDING MEMBER. One of the earliest.

What this means:
€5/mo forever (not just 12 months)
Launch credits (€20 value)
Early feature access


Want to lock in €5 or get a free month? Get 2 friends:
${referralLink}

Thank you for believing and supporting in me.
— Abraham`
    } else if (rank <= 1000) {
        subject = 'EARLY BIRD Status Secured'
        text = `Nice.

You're #${rank}. That's EARLY BIRD status.

What you get:
✅ €5/mo for 12 months
✅ First wave access

Want to lock in €5 or get a free month? Get 2 friends:
${referralLink}

Thanks for being early.
— Abraham`
    } else if (rank <= 2000) {
        subject = 'You Snagged the €5 Deal'
        text = `Good reflexes.

You're #${rank}. You got the PIONEER status.

What this means:
✅ €5/mo for 12 months (saved €3/mo!)
✅ Something special at launch

Get 2 friends for your first month FREE:
${referralLink}

See you at launch.
— Abraham`
    } else {
        return // Only send special emails for top 2,000
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            text
        })
    } catch (error) {
        console.error('Failed to send status unlock email:', error)
    }
}
