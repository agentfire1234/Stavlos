import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { pipeline } from 'https://esm.sh/@xenova/transformers@2.5.0'

const generateEmbedding = await pipeline(
    'feature-extraction',
    'Supabase/gte-small'
)

serve(async (req) => {
    const { text } = await req.json()

    const output = await generateEmbedding(text, {
        pooling: 'mean',
        normalize: true,
    })

    const embedding = Array.from(output.data)

    return new Response(
        JSON.stringify({ embedding }),
        { headers: { 'Content-Type': 'application/json' } }
    )
})
