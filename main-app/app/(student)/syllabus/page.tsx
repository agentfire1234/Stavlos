'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    Upload,
    Trash2,
    Loader2,
    BookOpen,
    ArrowRight,
    Search,
    FileText,
} from 'lucide-react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

export default function SyllabusPage() {
    const [syllabuses, setSyllabuses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStep, setUploadStep] = useState(0)
    const [courseName, setCourseName] = useState('')

    const supabase = createClient()

    useEffect(() => {
        loadSyllabuses()
    }, [])

    async function loadSyllabuses() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('syllabuses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            setSyllabuses(data || [])
        }
        setLoading(false)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: handleUpload
    })

    async function handleUpload(files: File[]) {
        if (!courseName.trim()) {
            toast.error("Please enter a course name first.")
            return
        }

        const file = files[0]
        setIsUploading(true)
        setUploadStep(0)

        const steps = [
            "Extracted text",
            "Chunking content",
            "Creating embeddings",
            "Complete"
        ]

        const interval = setInterval(() => {
            setUploadStep(prev => (prev < 3 ? prev + 1 : prev))
        }, 1500)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('courseName', courseName)

            const res = await fetch('/api/syllabus/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error()

            toast.success("Syllabus uploaded successfully.")
            setCourseName('')
            loadSyllabuses()
        } catch (error) {
            toast.error("Upload failed. Please try again.")
        } finally {
            clearInterval(interval)
            setIsUploading(false)
        }
    }

    async function deleteSyllabus(id: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const confirmDelete = confirm("Are you sure you want to delete this syllabus?")
        if (!confirmDelete) return

        const { error } = await supabase.from('syllabuses').delete().eq('id', id).eq('user_id', user.id)
        if (error) toast.error("Could not delete syllabus.")
        else {
            toast.success("Syllabus removed.")
            loadSyllabuses()
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            <header>
                <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">My Syllabi</h1>
                <p className="text-[15px] text-[#94a3b8] font-medium mt-1">
                    Manage your course materials and AI knowledge base.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8">
                {/* Left: Upload Section */}
                <div className="space-y-6">
                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider px-1">Course Name</label>
                            <input
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="e.g. Advanced Biology 201"
                                className="w-full h-11 bg-[#111318] border border-[#2d3139] rounded-lg px-4 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#3b82f6] transition-all"
                            />
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center gap-4 transition-all cursor-pointer ${isDragActive ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 'border-[#2d3139] hover:border-[#3b82f6]/50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <Upload className={`w-8 h-8 ${isDragActive ? 'text-[#3b82f6]' : 'text-[#64748b]'}`} />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-[#e2e8f0]">{isDragActive ? 'Drop PDF here' : 'Drop PDF or click to browse'}</p>
                                <p className="text-[12px] text-[#64748b]">Supports PDF up to 50MB</p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2"
                                >
                                    <div className="bg-[#111318] rounded-lg p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
                                            <span className="text-[13px] font-medium text-[#e2e8f0]">Processing document...</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#2d3139] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#3b82f6]"
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${(uploadStep + 1) * 25}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-[#64748b] text-center font-medium">
                                            {["Extracting text...", "Chunking content...", "Creating embeddings...", "Finalizing..."][uploadStep]}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Gallery Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-base font-semibold font-syne text-[#e2e8f0]">Active Courses</h2>
                        <span className="text-[13px] font-medium text-[#64748b]">{syllabuses.length} syllabi</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-[#1e2128] border border-[#2d3139] rounded-xl h-40 animate-pulse" />
                            ))
                        ) : syllabuses.map((s) => (
                            <motion.div
                                key={s.id}
                                layout
                                className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d4351] transition-all group"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 pr-4">
                                            <h3 className="text-sm font-semibold text-[#e2e8f0] truncate">{s.course_name}</h3>
                                            <p className="text-[12px] text-[#64748b] truncate mt-1 flex items-center gap-1.5">
                                                <FileText className="w-3 h-3" />
                                                {s.file_name}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteSyllabus(s.id)}
                                            className="p-1.5 text-[#64748b] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#1a2540] text-[#3b82f6] text-[11px] font-medium px-2 py-0.5 rounded">
                                            {s.total_chunks} chunks
                                        </span>
                                        <span className="text-[11px] text-[#64748b]">
                                            Indexed {new Date(s.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/chat?syllabus=${s.id}`}
                                    className="mt-6 flex items-center justify-center gap-2 w-full h-9 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-medium rounded-lg transition-all"
                                >
                                    Ask AI <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {syllabuses.length === 0 && !loading && (
                        <div className="bg-[#1e2128] border border-[#2d3139] border-dashed rounded-xl p-16 flex flex-col items-center text-center gap-4">
                            <BookOpen className="w-10 h-10 text-[#2d3139]" />
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-[#e2e8f0]">No syllabi yet</p>
                                <p className="text-sm text-[#64748b] max-w-[280px]">Upload your first PDF to enable syllabus-specific AI chat for that course.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
