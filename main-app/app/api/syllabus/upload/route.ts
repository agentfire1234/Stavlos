import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RAGSystem } from '@/lib/ai/rag-system'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const fileInput = formData.get('file') as File | null

        // 1. Auth Check (Real Supabase Auth)
        const cookieStore = await cookies()
        const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                },
            }
        )
        const { data: { user } } = await supabaseServer.auth.getUser()

        if (!user || !fileInput) {
            return NextResponse.json({ error: 'Missing file or session' }, { status: 400 })
        }
        const userId = user.id
        const courseName = (formData.get('courseName') as string) || fileInput.name.replace('.pdf', '')

        // Convert File to Buffer
        const bytes = await fileInput.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Process Syllabus (Extract -> Chunk -> Embed -> Store)
        const syllabusId = await RAGSystem.processSyllabus(
            buffer,
            userId,
            courseName
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
