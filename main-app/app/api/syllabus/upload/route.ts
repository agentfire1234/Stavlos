import { NextResponse } from 'next/server'
import { RAGSystem } from '@/lib/ai/rag-system'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const userId = req.headers.get('x-user-id')

        if (!userId || !file) {
            return NextResponse.json({ error: 'Missing file or user' }, { status: 400 })
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Process Syllabus (Extract -> Chunk -> Embed -> Store)
        const syllabusId = await RAGSystem.processSyllabus(
            buffer,
            userId,
            file.name
        )

        return NextResponse.json({
            success: true,
            syllabusId,
            message: 'Syllabus processed and ready for AI analysis'
        })

    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        )
    }
}
