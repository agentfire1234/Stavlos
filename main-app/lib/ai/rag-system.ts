import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'
import pdfParse from 'pdf-parse'

// We use OpenAI direct for embeddings as it's reliable and cheap
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export class RAGSystem {

    static async processSyllabus(pdfBuffer: Buffer, userId: string, courseName: string): Promise<string> {
        // 1. Extract text
        const pdfData = await pdfParse(pdfBuffer)
        const text = pdfData.text

        // 2. Chunk text
        const chunks = this.chunkText(text, 500)

        // 3. Create Syllabus record
        const { data: syllabus, error } = await supabaseAdmin
            .from('syllabuses')
            .insert({ user_id: userId, course_name: courseName })
            .select()
            .single()

        if (error) throw new Error(`Failed to create syllabus: ${error.message}`)

        // 4. Generate Embeddings & Store Chunks
        // Process in batches to avoid rate limits
        const embeddings: number[][] = []

        for (let i = 0; i < chunks.length; i += 20) {
            const batch = chunks.slice(i, i + 20)
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: batch
            })
            embeddings.push(...response.data.map((d: any) => d.embedding))

            // Small delay to be nice to API
            await new Promise(r => setTimeout(r, 100))
        }

        const chunkRecords = chunks.map((chunk, i) => ({
            syllabus_id: syllabus.id,
            chunk_text: chunk,
            chunk_index: i,
            embedding: embeddings[i]
        }))

        const { error: chunkError } = await supabaseAdmin
            .from('syllabus_chunks')
            .insert(chunkRecords)

        if (chunkError) throw new Error(`Failed to store chunks: ${chunkError.message}`)

        return syllabus.id
    }

    static chunkText(text: string, maxLength: number = 500): string[] {
        // Split by sentence terminators
        const sentences = text.split(/([.!?]+)/)
        const chunks: string[] = []
        let current = ''

        for (let i = 0; i < sentences.length; i += 2) {
            const sentence = sentences[i] + (sentences[i + 1] || '')
            if (!sentence.trim()) continue

            if ((current + sentence).length > maxLength) {
                if (current) chunks.push(current.trim())
                current = sentence
            } else {
                current += ' ' + sentence
            }
        }
        if (current) chunks.push(current.trim())

        return chunks
    }

    static async querySyllabus(question: string, userId: string) {
        // 1. Embed query
        const questionEmb = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: question
        })

        // 2. Search specific user's syllabuses
        const { data: chunks, error } = await supabaseAdmin.rpc('match_syllabus_chunks', {
            query_embedding: questionEmb.data[0].embedding,
            match_threshold: 0.5, // Lower threshold to find more context
            match_count: 5,
            filter_user_id: userId
        })

        if (error) {
            console.error('Vector search error:', error)
            return { found: false, message: "Error searching syllabus." }
        }

        if (!chunks || chunks.length === 0) {
            return {
                found: false,
                message: "I couldn't find that specific info in your uploaded syllabus. Shall I answer from general knowledge?"
            }
        }

        // 3. Format context
        const context = chunks.map((c: any) => c.chunk_text).join('\n\n')

        // 4. Generate answer uses OpenRouter via Orchestrator, but RAG system creates the context
        // We return the context to the orchestrator to perform the final generation
        return {
            found: true,
            context,
            ids: chunks.map((c: any) => c.id)
        }
    }
}
