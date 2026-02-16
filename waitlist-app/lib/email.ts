import { Resend } from 'resend'
import { getBadge } from './referral'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface WelcomeEmailParams {
    to: string
    rank: number
    referralLink: string
}

const FROM_EMAIL = process.env.NEXT_PUBLIC_EMAIL_SENDER || 'Abraham at Stavlos <abraham@stavlos.com>'

export async function sendWelcomeEmail({ to, rank, referralLink }: WelcomeEmailParams) {
    const badge = getBadge(rank)

    const subject = `You're #${rank} in line 🎯`

    const text = `Hey!

Welcome to Stavlos. You're officially on the waitlist. Thanks for joining and helping me 😆

Your current rank: #${rank}
Your status: ${badge.title}

🎁 Want 10% off for 12 months?
Get 2 friends to join using your link:
${referralLink}

I'm Abraham, 14, building this for students like us.
Launch is September 2025.

Stay tuned.
— Abraham
Founder, Stavlos

P.S. Top 2,000 get €5/mo instead of €8/mo. You're ${rank <= 2000 ? 'IN! 🎉' : 'close!'}`

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
        subject = '🏆 FOUNDING MEMBER Status Unlocked'
        text = `Wow.

You're #${rank}. That makes you a FOUNDING MEMBER. One of the earliest 😦

What this means:
✅ €5/mo forever (not just 12 months)
✅ Launch credits (€20 value)
✅ Early feature access

Plus, you're in the top 2,000 - you get Pro for €5/mo.

Want 10% off too? Share your link:
${referralLink}

Thank you for believing in me.
— Abraham`
    } else if (rank <= 1000) {
        subject = '🐦 EARLY BIRD Status Secured'
        text = `Nice.

You're #${rank}. That's EARLY BIRD status.

What you get:
✅ €5/mo for 12 months
✅ First wave access

Want an extra 10% off? Get 2 friends:
${referralLink}

Thanks for being early.
— Abraham`
    } else if (rank <= 2000) {
        subject = '🚀 You Snagged the €5 Deal'
        text = `Good reflexes.

You're #${rank}. You got the PIONEER status.

What this means:
✅ €5/mo for 12 months (saved €3/mo!)
✅ Something special at launch 👀

Get 2 friends for 10% off:
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
