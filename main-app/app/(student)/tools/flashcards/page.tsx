'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Layers,
    ArrowLeft,
    Send,
    RotateCcw,
    Loader2,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Rotate3d,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function FlashcardPage() {
    const [input, setInput] = useState('')
    const [cards, setCards] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    async function handleGenerate() {
        if (!input.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/tools/flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()

            // Extract JSON from response
            const match = data.result.match(/\[[\s\S]*\]/)
            if (match) {
                setCards(JSON.parse(match[0]))
                setIndex(0)
                setIsFlipped(false)
            } else {
                toast.error("Stavlos failed to parse card array. Try simpler notes.")
            }
        } catch (error) {
            toast.error("Flashcard generator failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors font-syne">
                <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>

            <header className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Active Recall</h1>
                    <p className="text-[15px] font-medium text-[#94a3b8]">Turn your lecture notes into high-impact study cards instantly.</p>
                </div>
            </header>

            {!cards.length ? (
                <div className="space-y-6">
                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-2 focus-within:border-orange-500/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your notes here to generate a deck..."
                            className="w-full bg-transparent border-none outline-none resize-none p-6 text-[15px] text-[#e2e8f0] min-h-[300px] placeholder:text-[#475569]"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !input.trim()}
                        className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 rounded-xl text-[14px] font-semibold text-[#111318] flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/10"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Flashcards <Sparkles className="w-4 h-4" /></>}
                    </button>
                </div>
            ) : (
                <div className="space-y-12 flex flex-col items-center">
                    {/* Card Container */}
                    <div
                        className="relative w-full max-w-lg h-[320px] cursor-pointer perspective-1000"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            className="w-full h-full relative preserve-3d"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-[#1e2128] border border-[#2d3139] rounded-2xl p-12 flex flex-col items-center justify-center text-center group active:scale-95 transition-transform">
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Question</span>
                                <p className="text-[17px] font-semibold text-[#e2e8f0] leading-relaxed">
                                    {cards[index].question}
                                </p>
                                <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-orange-500/50">
                                    <Rotate3d className="w-3.5 h-3.5" /> Tap to flip
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-[#111318] border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center rotate-y-180">
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-wider text-emerald-500/50">Answer</span>
                                <p className="text-[16px] font-medium text-[#c0cfdf] leading-relaxed">
                                    {cards[index].answer}
                                </p>
                                <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-500/30">
                                    <Rotate3d className="w-3.5 h-3.5" /> Tap to flip
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIndex(i => Math.max(0, i - 1)); setIsFlipped(false); }}
                            disabled={index === 0}
                            className="p-3 bg-[#1e2128] border border-[#2d3139] rounded-xl text-[#64748b] hover:text-[#e2e8f0] disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center min-w-[100px]">
                            <p className="text-xl font-bold font-syne text-[#e2e8f0] tracking-wider">
                                {index + 1}<span className="text-[#475569]"> / {cards.length}</span>
                            </p>
                            <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mt-0.5">Progress</p>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); setIndex(i => Math.min(cards.length - 1, i + 1)); setIsFlipped(false); }}
                            disabled={index === cards.length - 1}
                            className="p-3 bg-[#1e2128] border border-[#2d3139] rounded-xl text-[#64748b] hover:text-[#e2e8f0] disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <button
                        onClick={() => { setCards([]); setInput(''); }}
                        className="flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset and clear deck
                    </button>
                </div>
            )}

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    )
}
