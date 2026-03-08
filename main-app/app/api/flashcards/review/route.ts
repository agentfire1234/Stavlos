import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateNextReview } from '@/lib/ai/flashcard-engine'

export async function POST(req: Request) {
    try {
        const { cardId, quality, setId: providedSetId } = await req.json()

        if (!cardId || typeof quality !== 'number') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let setId = providedSetId
        if (!setId) {
            const { data: card } = await supabaseAdmin
                .from('flashcards')
                .select('set_id')
                .eq('id', cardId)
                .single()
            setId = card?.set_id
        }

        if (!setId) {
            return NextResponse.json({ error: 'Set ID not found' }, { status: 400 })
        }

        const userId = user.id

        // 1. Get or create progress record
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from('flashcard_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .single()

        const progress = existing || {
            user_id: userId,
            card_id: cardId,
            set_id: setId,
            ease_factor: 2.5,
            interval: 0,
            repetitions: 0,
            total_reviews: 0,
            correct_reviews: 0
        }

        // 2. Calculate next review logic
        const next = calculateNextReview({
            ease_factor: progress.ease_factor,
            interval: progress.interval,
            repetitions: progress.repetitions
        }, quality)

        // 3. Update DB
        const { error: upsertError } = await supabaseAdmin
            .from('flashcard_progress')
            .upsert({
                user_id: userId,
                card_id: cardId,
                set_id: setId,
                ease_factor: next.ease_factor,
                interval: next.interval,
                repetitions: next.repetitions,
                next_review_at: next.next_review_at.toISOString(),
                last_reviewed_at: new Date().toISOString(),
                total_reviews: (progress.total_reviews || 0) + 1,
                correct_reviews: (progress.correct_reviews || 0) + (quality >= 3 ? 1 : 0),
            }, { onConflict: 'user_id,card_id' })

        if (upsertError) {
            throw upsertError
        }

        return NextResponse.json({ success: true, nextReview: next.next_review_at })

    } catch (error: any) {
        console.error('Flashcard Review Update Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
