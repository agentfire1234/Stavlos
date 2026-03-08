export interface FlashcardProgress {
    ease_factor: number
    interval: number
    repetitions: number
}

export interface SM2Result {
    ease_factor: number
    interval: number
    repetitions: number
    next_review_at: Date
}

/**
 * Calculates the next review date and SM-2 stats based on performance.
 * Quality: 4 = "Got it", 1 = "Review Again" (Simplified from SM-2 0-5 scale)
 */
export function calculateNextReview(card: FlashcardProgress, quality: number): SM2Result {
    let { ease_factor, interval, repetitions } = card

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            interval = 1
        } else if (repetitions === 1) {
            interval = 6
        } else {
            interval = Math.round(interval * ease_factor)
        }
        repetitions += 1
    } else {
        // Incorrect response — reset
        repetitions = 0
        interval = 1
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // Using quality 4 for "Good" and 1 for "Again"
    const q = quality
    ease_factor = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

    // Ease factor never goes below 1.3
    if (ease_factor < 1.3) ease_factor = 1.3

    const next_review_at = new Date()
    next_review_at.setDate(next_review_at.getDate() + interval)

    return { ease_factor, interval, repetitions, next_review_at }
}

export function parseFlashcardJSON(raw: string): { title?: string, cards: Array<{ front: string; back: string }> } {
    // Strip any markdown code blocks if present
    const cleaned = raw
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

    // Find the JSON block (either { or [)
    const startObj = cleaned.indexOf('{')
    const startArr = cleaned.indexOf('[')

    let start = -1
    let end = -1

    if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
        start = startObj
        end = cleaned.lastIndexOf('}')
    } else {
        start = startArr
        end = cleaned.lastIndexOf(']')
    }

    if (start === -1 || end === -1) {
        throw new Error('No JSON found in AI response')
    }

    const jsonStr = cleaned.substring(start, end + 1)
    const parsed = JSON.parse(jsonStr)

    if (Array.isArray(parsed)) {
        return {
            cards: parsed.filter((card: any) => card.front && card.back)
        }
    } else if (parsed && Array.isArray(parsed.cards)) {
        return {
            title: parsed.title,
            cards: parsed.cards.filter((card: any) => card.front && card.back)
        }
    }

    throw new Error('Invalid flashcard format')
}
