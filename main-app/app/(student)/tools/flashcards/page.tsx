'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Layers,
    BookOpen,
    PenLine,
    Sparkles,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export default function FlashcardGeneratorPage() {
    const router = useRouter()
    const supabase = createClient()

    // Form State
    const [title, setTitle] = useState('')
    const [source, setSource] = useState<'notes' | 'syllabus'>('notes')
    const [notes, setNotes] = useState('')
    const [selectedSyllabus, setSelectedSyllabus] = useState('')
    const [cardCount, setCardCount] = useState(10)

    // Status State
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successData, setSuccessData] = useState<{ setId: string, title: string, count: number } | null>(null)

    // Data State
    const [syllabi, setSyllabi] = useState<any[]>([])

    useEffect(() => {
        if (source === 'syllabus') {
            fetchSyllabi()
        }
    }, [source])

    async function fetchSyllabi() {
        const { data, error } = await supabase
            .from('syllabuses')
            .select('id, course_name')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching syllabi:', error)
            toast.error('Failed to load syllabi')
        } else {
            setSyllabi(data || [])
        }
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        if (source === 'notes' && !notes.trim()) return
        if (source === 'syllabus' && !selectedSyllabus) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/flashcards/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    source,
                    notes: source === 'notes' ? notes : null,
                    syllabusId: source === 'syllabus' ? selectedSyllabus : null,
                    cardCount
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate flashcards')
            }

            setSuccessData({
                setId: data.setId,
                title: data.title,
                count: data.cardCount
            })
            toast.success('Flashcards generated successfully!')
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const isButtonDisabled = !title.trim() || (source === 'notes' && !notes.trim()) || (source === 'syllabus' && !selectedSyllabus) || isLoading

    return (
        <div className="max-w-[760px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-[28px] font-black font-syne text-[#f97316]">Flashcard Generator</h1>
                    <p className="text-[#94a3b8] font-medium text-[15px]">Turn your notes into active recall flashcards.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="relative">
                            <Loader2 size={48} className="text-[#f97316] animate-spin" />
                            <Sparkles size={20} className="text-[#f97316] absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white">Generating your flashcards...</h2>
                            <p className="text-slate-400">Creating {cardCount} cards from your {source === 'notes' ? 'notes' : 'syllabus'}</p>
                        </div>
                    </motion.div>
                ) : successData ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-10 border-[#10b981]/30 flex flex-col items-center text-center space-y-8"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Your flashcards are ready!</h2>
                            <p className="text-slate-400">{successData.count} cards · {successData.title}</p>
                        </div>

                        <div className="w-full space-y-3">
                            <Link
                                href={`/flashcards/${successData.setId}`}
                                className="flex items-center justify-center w-full h-[44px] bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all gap-2"
                            >
                                Open Flashcards <ChevronRight size={18} />
                            </Link>
                            <button
                                onClick={() => {
                                    setSuccessData(null)
                                    setTitle('')
                                    setNotes('')
                                }}
                                className="w-full text-slate-500 font-semibold hover:text-slate-300 py-2 transition-colors"
                            >
                                Generate Another Set
                            </button>
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 border-red-500/30 flex flex-col items-center text-center space-y-6"
                    >
                        <AlertCircle size={48} className="text-red-500" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white">Generation failed</h2>
                            <p className="text-red-400 font-medium">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleGenerate}
                        className="glass-card p-8 space-y-8 shadow-2xl shadow-black/20"
                    >
                        {/* Set Title */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Set Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Biology Chapter 3, History Exam"
                                className="w-full bg-[#1a1f27] border border-[#2d3139] rounded-xl px-5 h-12 text-white placeholder:text-slate-600 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all outline-none font-medium"
                                required
                            />
                        </div>

                        {/* Source Toggle */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Source Material</label>
                            <div className="flex p-1.5 bg-[#111318] rounded-xl border border-[#2d3139]">
                                <button
                                    type="button"
                                    onClick={() => setSource('notes')}
                                    className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${source === 'notes' ? 'bg-[#f97316] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    <PenLine size={16} /> My Notes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSource('syllabus')}
                                    className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${source === 'syllabus' ? 'bg-[#f97316] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    <BookOpen size={16} /> From Syllabus
                                </button>
                            </div>
                        </div>

                        {/* Content Input */}
                        <div className="space-y-3">
                            {source === 'notes' ? (
                                <div className="relative">
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Paste your notes or study material here..."
                                        className="w-full min-h-[160px] bg-[#1a1f27] border border-[#2d3139] rounded-xl p-5 text-[15px] text-white placeholder:text-slate-600 focus:border-[#f97316] transition-all outline-none leading-relaxed resize-none"
                                    />
                                    <div className="absolute bottom-4 right-5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        {notes.trim().split(/\s+/).filter(Boolean).length} words
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {syllabi.length > 0 ? (
                                        <select
                                            value={selectedSyllabus}
                                            onChange={(e) => setSelectedSyllabus(e.target.value)}
                                            className="w-full bg-[#1a1f27] border border-[#2d3139] rounded-xl px-4 h-12 text-white outline-none focus:border-[#f97316] transition-all appearance-none cursor-pointer font-medium"
                                        >
                                            <option value="" disabled>Select a course...</option>
                                            {syllabi.map((s) => (
                                                <option key={s.id} value={s.id}>{s.course_name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-6 bg-white/5 rounded-xl border border-[#2d3139] border-dashed text-center space-y-4">
                                            <p className="text-slate-400 text-sm">No syllabi uploaded yet.</p>
                                            <Link href="/syllabus" className="inline-block text-[#3b82f6] text-sm font-bold hover:underline">
                                                Upload one first →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Card Count */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Number of Cards</label>
                            <div className="grid grid-cols-4 gap-3">
                                {[5, 10, 15, 20].map((count) => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setCardCount(count)}
                                        className={`h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${cardCount === count
                                                ? 'bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-500/20'
                                                : 'bg-[#1a1f27] border-[#2d3139] text-slate-400 hover:border-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={isButtonDisabled}
                            type="submit"
                            className={`w-full h-12 rounded-xl flex items-center justify-center font-bold text-[15px] transition-all ${isButtonDisabled
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-[#2d3139]'
                                    : 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-xl shadow-orange-500/10'
                                }`}
                        >
                            Generate Flashcards
                        </motion.button>
                        <p className="text-center text-[11px] text-slate-600 font-medium">Cmd + Enter to generate</p>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
