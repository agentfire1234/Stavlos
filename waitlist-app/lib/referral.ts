import crypto from 'crypto'

// Generate unique 8-character referral code
export function generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex')
}

// Get badge based on rank
export function getBadge(rank: number) {
    if (rank <= 100) {
        return {
            title: 'FOUNDING MEMBER ⭐',
            perks: '€5/mo forever + Launch Credits'
        }
    } else if (rank <= 1000) {
        return {
            title: 'EARLY BIRD 🐦',
            perks: '€5/mo for 12 months + Beta Access'
        }
    } else if (rank <= 2000) {
        return {
            title: 'PIONEER 🚀',
            perks: '€5/mo for 12 months + Launch Templates'
        }
    } else {
        return {
            title: 'STAVLOS SCHOLAR 📚',
            perks: '€8/mo + Community Access'
        }
    }
}

// Check if user gets referral discount (2+ referrals = 10% off for 12 months)
export function getReferralDiscount(referralCount: number): number {
    return referralCount >= 2 ? 0.10 : 0
}

// Calculate final price
export function calculatePrice(rank: number, referralCount: number): number {
    const basePrice = rank <= 2000 ? 5 : 8
    const discount = getReferralDiscount(referralCount)
    return basePrice * (1 - discount)
}
