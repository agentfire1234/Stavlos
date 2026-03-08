import { supabaseAdmin } from '@/lib/supabase'
import pdfParse from 'pdf-parse'

export class RAGSystem {

    static async processSyllabus(
        pdfBuffer: Buffer,
        userId: string,
        courseName: string
    ): Promise<string> {
        // Extract text from PDF
        const pdfData = await pdfParse(pdfBuffer)
        const text = pdfData.text

        if (!text || text.trim().length === 0) {
            throw new Error(
                'Could not extract text from this PDF. ' +
                'Make sure it contains readable text, not scanned images.'
            )
        }

        // Chunk the text
        const chunks = this.chunkText(text, 500)

        // Create syllabus record
        const { data: syllabus, error: syllabusError } = await supabaseAdmin
            .from('syllabuses')
            .insert({
                user_id: userId,
                course_name: courseName,
                total_chunks: chunks.length
            })
            .select()
            .single()

        if (syllabusError || !syllabus) {
            throw new Error('Failed to create syllabus record')
        }

        // Generate embeddings using Supabase's free built-in model
        // Process in batches of 10 to avoid timeouts
        const chunkRecords: {
            syllabus_id: string;
            chunk_text: string;
            chunk_index: number;
            embedding: number[];
        }[] = []

        for (let i = 0; i < chunks.length; i += 10) {
            const batch = chunks.slice(i, i + 10)

            const embeddingPromises = batch.map(async (chunk) => {
                const { data, error } = await supabaseAdmin.functions.invoke(
                    'generate-embedding',
                    { body: { text: chunk } }
                )
                if (error) throw error
                return data.embedding as number[]
            })

            const batchEmbeddings = await Promise.all(embeddingPromises)

            batch.forEach((chunk, batchIndex) => {
                chunkRecords.push({
                    syllabus_id: syllabus.id,
                    chunk_text: chunk,
                    chunk_index: i + batchIndex,
                    embedding: batchEmbeddings[batchIndex]
                })
            })

            // Small delay between batches
            if (i + 10 < chunks.length) {
                await new Promise(r => setTimeout(r, 200))
            }
        }

        console.log('--- RAG INSERT DEBUG ---')
        console.log('Chunk count:', chunkRecords.length)
        console.log('First embedding length:', chunkRecords[0]?.embedding?.length)
        console.log('First chunk text length:', chunkRecords[0]?.chunk_text?.length)
        console.log('------------------------')

        // Insert all chunks
        const { error: chunksError } = await supabaseAdmin
            .from('syllabus_chunks')
            .insert(chunkRecords)

        if (chunksError) {
            console.error('EXACT INSERT ERROR:', JSON.stringify(chunksError, null, 2))

            // Clean up syllabus record if chunks failed
            await supabaseAdmin
                .from('syllabuses')
                .delete()
                .eq('id', syllabus.id)
            throw new Error(`Failed to process syllabus chunks: ${chunksError.message}`)
        }

        return syllabus.id
    }

    static async querySyllabus(
        question: string,
        syllabusId: string,
        userId: string
    ) {
        // Generate embedding for the question
        const { data, error } = await supabaseAdmin.functions.invoke(
            'generate-embedding',
            { body: { text: question } }
        )

        if (error || !data?.embedding) {
            // Fallback: return all chunks if embedding fails
            const { data: chunks } = await supabaseAdmin
                .from('syllabus_chunks')
                .select('chunk_text')
                .eq('syllabus_id', syllabusId)
                .limit(5)

            return {
                found: !!chunks?.length,
                context: chunks?.map((c: any) => c.chunk_text).join('\n\n') || '',
                ids: chunks?.map((c: any) => c.id) || []
            }
        }

        console.log('--- RAG QUERY DEBUG ---')
        console.log('Querying syllabus:', syllabusId)
        console.log('User ID:', userId)
        console.log('Question embedding length:', data?.embedding?.length)

        // Vector similarity search
        const { data: chunks, error: rpcError } = await supabaseAdmin.rpc(
            'match_syllabus_chunks',
            {
                query_embedding: data.embedding,
                match_threshold: 0.5,
                match_count: 5,
                filter_user_id: userId,
                filter_syllabus_id: syllabusId || null
            }
        )

        console.log('Chunks found:', chunks?.length)
        console.log('Raw RPC result:', JSON.stringify(chunks))
        if (rpcError) console.error('RPC ERROR:', rpcError)
        console.log('-----------------------')

        return {
            found: !!chunks?.length,
            context: chunks?.map((c: any) => c.chunk_text).join('\n\n') || '',
            ids: chunks?.map((c: any) => c.id) || []
        }
    }

    static chunkText(text: string, chunkSize: number): string[] {
        // Clean the text first
        const cleaned = text
            .replace(/\s+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim()

        const words = cleaned.split(' ')
        const chunks: string[] = []

        for (let i = 0; i < words.length; i += chunkSize) {
            const chunk = words.slice(i, i + chunkSize).join(' ')
            if (chunk.trim().length > 0) {
                chunks.push(chunk)
            }
        }

        return chunks
    }
}
