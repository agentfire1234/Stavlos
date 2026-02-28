import { Resend } from 'resend'
import { getBadge } from './referral'

// Use a safe fallback for build time. Runtime will fail if key is missing, which is expected.
const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

interface WelcomeEmailParams {
    to: string
    rank: number
    referralLink: string
}

const FROM_EMAIL = process.env.NEXT_PUBLIC_EMAIL_SENDER || 'Stavlos <hello@send.stavlos.com>'

export async function sendWelcomeEmail({ to, rank, referralLink }: WelcomeEmailParams) {
    const badge = getBadge(rank)

    let subject = `Welcome to Stavlos! You're #${rank} in line`
    let statusSection = ''

    if (rank <= 100) {
        subject = 'FOUNDING MEMBER Status Unlocked'
        statusSection = `
Wow. You're #${rank}, which makes you a FOUNDING MEMBER. 

Exclusive Perks for You:
✅ €5/mo locked in forever
✅ €20 in launch credits
✅ Early feature access
`
    } else if (rank <= 1000) {
        subject = 'EARLY BIRD Status Secured'
        statusSection = `
Nice. You're #${rank}, securing EARLY BIRD status.

Your Perks:
✅ €5/mo for 12 months
✅ First wave beta access
`
    } else if (rank <= 2000) {
        subject = 'You Snagged the €5 Deal'
        statusSection = `
Good reflexes. You're #${rank}, which gives you PIONEER status.

Your Perk:
✅ €5/mo for 12 months (saved €3/mo!)
`
    }

    const text = `Hey!

Welcome to Stavlos. You're officially on the waitlist. Thanks for joining and supporting me.

Your current rank: #${rank}
Your status: ${badge.title}
${statusSection}
🎁 Want to lock in the €5 price forever (or get a free month)?
Just get 2 friends to join using your link:
${referralLink}

I'm Abraham, 14, building this for students like us.
Launch is June 2026.

Stay tuned.
— Abraham
Founder, Stavlos

P.S. Top 2,000 get the discount. You're ${rank <= 2000 ? 'set!' : 'close!'}`

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
