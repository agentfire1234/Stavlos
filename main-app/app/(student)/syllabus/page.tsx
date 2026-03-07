'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    Upload,
    FileText,
    Zap,
    Trash2,
    Loader2,
    CheckCircle2,
    BookOpen,
    ArrowRight,
    Search,
    BrainCircuit,
    Cpu
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
            toast.error("Enter course name first, student.")
            return
        }

        const file = files[0]
        setIsUploading(true)
        setUploadStep(0)

        const steps = [
            "📄 Extracting text layers...",
            "✂️ Neural chunking active...",
            "🧠 Vectorizing synapses...",
            "✅ Knowledge Vault synced!"
        ]

        // Simulate steps for UI feedback
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

            toast.success("Syllabus integrated into the Student OS.")
            setCourseName('')
            loadSyllabuses()
        } catch (error) {
            toast.error("Neural upload failed. File too large?")
        } finally {
            clearInterval(interval)
            setIsUploading(false)
        }
    }

    async function deleteSyllabus(id: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { error } = await supabase.from('syllabuses').delete().eq('id', id).eq('user_id', user.id)
        if (error) toast.error("Could not purge data.")
        else {
            toast.success("Unit purged from vault.")
            loadSyllabuses()
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

            <header className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-syne italic leading-none">RAG Infrastructure</p>
                <h1 className="text-5xl font-black font-syne uppercase italic tracking-tight">The Knowledge <span className="text-purple-500">Vault</span></h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left: Upload Zone */}
                <div className="lg:col-span-4 space-y-8 sticky top-12">
                    <section className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 font-syne italic ml-1">Unit Identity</label>
                            <input
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="e.g. Advanced Biology 201"
                                className="w-full glass-card bg-white/5 border-white/10 p-4 font-dm-sans italic font-bold focus:border-purple-500/50 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>

                        <div
                            {...getRootProps()}
                            className={`glass-card p-12 flex flex-col items-center gap-6 text-center cursor-pointer transition-all border-dashed ${isDragActive ? 'border-purple-500 bg-purple-500/5' : 'border-white/10'
                                } ${isUploading ? 'pointer-events-none opacity-50' : 'hover:border-purple-500/50'}`}
                        >
                            <input {...getInputProps()} />
                            <div className="relative">
                                <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-full animate-pulse" />
                                <Upload className={`w-12 h-12 relative z-10 transition-colors ${isDragActive ? 'text-purple-500' : 'text-white/20'}`} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest font-syne italic">Drop PDF to Index</p>
                                <p className="text-[10px] text-white/20 font-dm-sans">Maximum 50MB per document</p>
                            </div>
                        </div>
                    </section>

                    <AnimatePresence>
                        {isUploading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 border-purple-500/20 bg-purple-500/5 space-y-4"
                            >
                                <div className="flex items-center gap-4">
                                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 font-syne italic">Vectorizing Neurons...</p>
                                </div>
                                <div className="space-y-2">
                                    {[0, 1, 2, 3].map((step) => {
                                        const labels = ["Extracting", "Chunking", "Embedding", "Ready"]
                                        const isActive = uploadStep === step
                                        const isDone = uploadStep > step
                                        return (
                                            <div key={step} className="flex items-center gap-3">
                                                <div className={`w-1 h-1 rounded-full ${isDone ? 'bg-purple-500' : isActive ? 'bg-white animate-pulse' : 'bg-white/5'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest font-syne italic ${isDone ? 'text-purple-500' : isActive ? 'text-white' : 'text-white/10'}`}>
                                                    {labels[step]}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Gallery */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic leading-none">Active Repositories</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white/20 font-dm-sans">{syllabuses.length} Units</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="glass-card h-40 animate-pulse bg-white/[0.02]" />
                            ))
                        ) : syllabuses.map((s) => (
                            <motion.div
                                key={s.id}
                                layout
                                whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(139,92,246,0.1)' }}
                                className="glass-card p-6 space-y-6 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 max-w-[80%]">
                                        <h3 className="text-sm font-black italic uppercase font-syne truncate group-hover:text-purple-400 transition-colors">{s.course_name}</h3>
                                        <p className="text-[10px] font-bold text-white/30 font-dm-sans">{new Date(s.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteSyllabus(s.id)}
                                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                                        <BrainCircuit className="w-3 h-3 text-purple-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest font-syne">{s.total_chunks || '—'} Chunks</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                                        <Cpu className="w-3 h-3 text-blue-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest font-syne">Vector Active</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/chat?context=${s.id}`}
                                    className="btn-primary w-full py-2 bg-purple-600/20 border border-purple-500/20 hover:bg-purple-600 hover:border-purple-600 text-[10px] font-black uppercase tracking-[0.2em] font-syne italic shadow-none"
                                >
                                    Access Intelligence <ArrowRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {syllabuses.length === 0 && !loading && (
                        <div className="glass-card p-20 text-center border-dashed border-white/10 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl glass-card flex items-center justify-center opacity-20">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-black italic font-syne uppercase tracking-wider text-white/40">Vault Offline</p>
                                <p className="text-xs font-bold font-dm-sans text-white/20 max-w-xs mx-auto">Upload your first syllabus to initialize the RAG neural network for this course.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
