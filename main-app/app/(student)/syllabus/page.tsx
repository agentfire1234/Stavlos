'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function SyllabusPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [courses, setCourses] = useState<any[]>([])
    const [loadingCourses, setLoadingCourses] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchCourses()
    }, [])

    async function fetchCourses() {
        setLoadingCourses(true)
        const { data } = await supabase
            .from('syllabuses')
            .select('*')
            .order('created_at', { ascending: false })

        setCourses(data || [])
        setLoadingCourses(false)
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setUploading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('file', file)
        formData.append('courseName', file.name.replace('.pdf', ''))

        try {
            const response = await fetch('/api/syllabus/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Upload failed')

            setMessage('✅ Syllabus analyzed successfully! Redirecting to chat...')
            setFile(null)
            fetchCourses()
        } catch (error: any) {
            setMessage(`❌ ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">My Syllabi</h1>
                <p className="text-white/40 font-medium">Manage and upload your course materials for AI analysis.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                    <div className="glass rounded-3xl p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Upload New</h2>
                        <p className="text-sm text-white/50 mb-8 leading-relaxed">
                            Abraham here. Just drop your PDF syllabus below and I'll chunk it into my brain so we can chat about it!
                        </p>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="group relative border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                                {file ? (
                                    <p className="text-sm font-bold text-blue-400 break-all">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm font-bold opacity-60">Click or drag PDF</p>
                                        <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">Max 10MB</p>
                                    </>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
                            >
                                {uploading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Analyzing PDF...
                                    </>
                                ) : (
                                    'Start Analysis'
                                )}
                            </button>
                        </form>

                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-xs font-bold ring-1 ${message.includes('❌') ? 'bg-red-500/5 ring-red-500/20 text-red-400' : 'bg-green-500/5 ring-green-500/20 text-green-400'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 ml-2">Active Courses</h2>

                    {loadingCourses ? (
                        <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest">Loading brain cells...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-20 glass rounded-3xl text-center border-dashed">
                            <p className="text-white/30 font-bold italic">No syllabi found. Upload your first one to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {courses.map((course) => (
                                <div key={course.id} className="glass rounded-2xl p-6 flex items-center justify-between hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-xl">
                                            📚
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{course.course_name}</h3>
                                            <p className="text-xs text-white/30 font-medium">Analyzed on {new Date(course.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                                            Chat
                                        </button>
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
