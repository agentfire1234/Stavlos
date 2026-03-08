import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch all cards where next_review_date <= now
        const now = new Date().toISOString()

        const { data: cards, error } = await supabase
            .from('flashcard_progress')
            .select(`
                *,
                flashcards (
                    id,
                    question,
                    answer,
                    set_id,
                    flashcard_sets (
                        title
                    )
                )
            `)
            .eq('user_id', user.id)
            .lte('next_review_date', now)
            .order('next_review_date', { ascending: true })

        if (error) throw error

        const formattedCards = cards.map((p: any) => ({
            id: p.flashcards.id,
            question: p.flashcards.question,
            answer: p.flashcards.answer,
            set_id: p.flashcards.set_id,
            set_title: p.flashcards.flashcard_sets.title,
            progress: {
                ease_factor: p.ease_factor,
                interval: p.interval,
                repetitions: p.repetitions
            }
        }))

        return NextResponse.json(formattedCards)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
