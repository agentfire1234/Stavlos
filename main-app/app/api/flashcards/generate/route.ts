import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AIClient } from '@/lib/ai/ai-client'
import { RAGSystem } from '@/lib/ai/rag-system'
import { parseFlashcardJSON } from '@/lib/ai/flashcard-engine'

export async function POST(req: Request) {
    try {
        const { notes, title, cardCount, syllabusId } = await req.json()

        if (!title || (!notes && !syllabusId)) {
            return NextResponse.json({ error: 'Title and content (notes or syllabus) are required' }, { status: 400 })
        }

        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = user.id

        // 1. Get Context
        let context = notes || ''
        if (syllabusId) {
            // Using a generic query for flashcard generation from the syllabus
            const rag = await RAGSystem.querySyllabus("Generate key study points and facts for flashcards from this material.", syllabusId, userId)
            if (rag.found) {
                context = rag.context
            }
        }

        // 2. Generate with AI
        const systemPrompt = `You are a flashcard generator. You MUST respond with ONLY a valid JSON array.
No text before or after. No markdown. No code blocks. No explanation. Just the JSON array.

Format exactly like this:
[
  {"front": "Question or term", "back": "Answer or definition"},
  {"front": "Question or term", "back": "Answer or definition"}
]

Generate exactly ${cardCount || 10} flashcards from the provided study material.
Make fronts concise (max 15 words). Make backs clear and complete.

Adapt your communication style to match the user's tone.
If they write short messages, respond short.
If they write casually with typos or slang, be casual back.
If they write formally, be formal.
If they use Dutch, respond in Dutch.
Mirror their energy — don't be stiff when they're relaxed.

If you don't know something or are not confident, 
say so directly. Examples:
- 'I don't know this one.'
- 'Not sure about that, you might want to Google it.'
- 'I can't find this in your syllabus and I'm not 
   confident enough to guess.'
Never make up answers. Never pretend to know something 
you don't.`

        const aiResponse = await AIClient.chat(
            `Study material for flashcards:\n\n${context}`,
            '', // We already injected context into the prompt for focus
            'meta-llama/llama-3.1-8b-instruct:free', // Fast, cheap model for generation
            'flashcard'
        )

        const completion = aiResponse as any
        const rawContent = completion.choices[0].message.content || ''

        let cards: Array<{ front: string, back: string }> = []
        try {
            const data = parseFlashcardJSON(rawContent)
            cards = data.cards
        } catch (e) {
            console.error('Failed to parse flashcard JSON:', rawContent)
            return NextResponse.json({ error: 'AI failed to generate valid flashcard format. Please try again.' }, { status: 500 })
        }

        // 3. Save to Supabase
        const { data: set, error: setError } = await supabaseAdmin
            .from('flashcard_sets')
            .insert({
                user_id: userId,
                title,
                source: syllabusId ? 'syllabus' : 'tool',
                syllabus_id: syllabusId || null,
                card_count: cards.length
            })
            .select()
            .single()

        if (setError || !set) {
            throw new Error(`Failed to create flashcard set: ${setError?.message || 'Unknown error'}`)
        }

        const flashcardsToInsert = cards.map((card, index) => ({
            set_id: set.id,
            front: card.front,
            back: card.back,
            card_index: index
        }))

        const { error: cardsError } = await supabaseAdmin
            .from('flashcards')
            .insert(flashcardsToInsert)

        if (cardsError) {
            // Cleanup set if cards fail
            await supabaseAdmin.from('flashcard_sets').delete().eq('id', set.id)
            throw new Error(`Failed to save flashcards: ${cardsError.message}`)
        }

        return NextResponse.json({
            setId: set.id,
            title: set.title,
            cardCount: cards.length
        })

    } catch (error: any) {
        console.error('Flashcard Generation Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
