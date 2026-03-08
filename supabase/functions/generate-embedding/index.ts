import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
    try {
        const { text } = await req.json()

        if (!text) {
            return new Response(
                JSON.stringify({ error: 'No text provided' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Use OpenAI compatible endpoint built into Supabase
        const response = await fetch(
            'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
            }
        )

        const embedding = await response.json()

        return new Response(
            JSON.stringify({ embedding: Array.isArray(embedding[0]) ? embedding[0] : embedding }),
            { headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})
