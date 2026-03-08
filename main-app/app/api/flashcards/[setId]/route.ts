import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    req: Request,
    { params }: { params: { setId: string } }
) {
    try {
        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { setId } = params

        // 1. Get Set Metadata
        const { data: set, error: setError } = await supabaseAdmin
            .from('flashcard_sets')
            .select('*')
            .eq('id', setId)
            .eq('user_id', user.id)
            .single()

        if (setError || !set) {
            return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 })
        }

        // 2. Get All Cards
        const { data: cards, error: cardsError } = await supabaseAdmin
            .from('flashcards')
            .select('*')
            .eq('set_id', setId)
            .order('card_index', { ascending: true })

        if (cardsError) {
            throw cardsError
        }

        return NextResponse.json({
            ...set,
            cards: cards || []
        })

    } catch (error: any) {
        console.error('Get Flashcard Set Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { setId: string } }
) {
    try {
        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { setId } = params

        const { error } = await supabaseAdmin
            .from('flashcard_sets')
            .delete()
            .eq('id', setId)
            .eq('user_id', user.id)

        if (error) {
            throw error
        }

        return NextResponse.json({ success: true, message: 'Flashcard set deleted' })

    } catch (error: any) {
        console.error('Delete Flashcard Set Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
