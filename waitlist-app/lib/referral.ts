import crypto from 'crypto'

// Generate unique 8-character referral code
export function generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex')
}

// Get badge based on rank
export function getBadge(rank: number) {
    if (rank <= 100) {
        return {
            title: 'FOUNDING MEMBER',
            color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
        }
    }
    if (rank <= 1000) {
        return {
            title: 'EARLY BIRD',
            color: 'bg-blue-500/20 text-blue-500 border-blue-500/50'
        }
    }
    if (rank <= 2000) {
        return {
            title: 'PIONEER',
            color: 'bg-purple-500/20 text-purple-500 border-purple-500/50'
        }
    }
    else {
        return {
            title: 'STAVLOS SCHOLAR',
            perks: '€8/mo + Early Access'
        }
    }
}

// Calculate final price based on rank and referrals
export function calculatePrice(rank: number, referralCount: number): { basePrice: number, finalPrice: number, perks: string[] } {
    const isTop2000 = rank <= 2000
    const hasReferralLock = referralCount >= 1

    // Base price is €5 for top 2000 OR if they referred 1+ person
    const finalPrice = (isTop2000 || hasReferralLock) ? 5 : 8

    const perks = []
    if (isTop2000) perks.push('Early Access Perk')
    if (hasReferralLock) perks.push('€5 Price Locked Forever')
    if (referralCount >= 2) perks.push('First Month Free Reward')

    return {
        basePrice: isTop2000 ? 5 : 8,
        finalPrice,
        perks
    }
}
