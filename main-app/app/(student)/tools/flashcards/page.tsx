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
            const match = data.result.match(/\[.*\]/s)
            if (match) {
                setCards(JSON.parse(match[0]))
                setIndex(0)
                setIsFlipped(false)
            } else {
                toast.error("Stavlos failed to parse card array. Try simpler notes.")
            }
        } catch (error) {
            toast.error("Flashcard engine failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-orange-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-orange-500/20 flex items-center justify-center mb-6">
                    <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">Active <span className="text-orange-500">Recall</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Turn your lecture notes into high-impact study cards instantly.</p>
            </header>

            {!cards.length ? (
                <div className="space-y-6">
                    <div className="glass-card p-2 border-white/10 focus-within:border-orange-500/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your notes here to generate a deck..."
                            className="w-full bg-transparent border-none outline-none resize-none p-6 text-sm font-dm-sans italic min-h-[300px] placeholder:text-white/10"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !input.trim()}
                        className="btn-primary w-full py-4 bg-orange-600 hover:bg-orange-500 border-none shadow-orange-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Distill Knowledge Deck <Sparkles className="w-4 h-4 ml-2" /></>}
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
                            className="w-full h-full relative transition-all duration-700 preserve-3d"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center border-orange-500/20 bg-orange-500/[0.02]">
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white/20 font-syne italic">Neural Inquiry</span>
                                <p className="text-xl font-bold font-dm-sans italic text-white/80 leading-relaxed">
                                    {cards[index].question}
                                </p>
                                <div className="absolute bottom-6 flex items-center gap-2 text-[9px] font-black uppercase text-orange-500 opacity-40 font-syne italic">
                                    <Rotate3d className="w-3 h-3" /> Tap to Flip
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center border-emerald-500/20 bg-emerald-500/[0.02] rotate-y-180">
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-emerald-500/40 font-syne italic">Verified Context</span>
                                <p className="text-lg font-bold font-dm-sans italic text-white/60 leading-relaxed">
                                    {cards[index].answer}
                                </p>
                                <div className="absolute bottom-6 flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500/40 font-syne italic">
                                    <Rotate3d className="w-3 h-3" /> Tap to Flip
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => { setIndex(i => Math.max(0, i - 1)); setIsFlipped(false); }}
                            disabled={index === 0}
                            className="p-4 glass-card border-white/5 disabled:opacity-5 text-white/40 hover:text-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center">
                            <p className="text-2xl font-black font-syne italic tracking-widest text-white">{index + 1}<span className="text-white/20"> / {cards.length}</span></p>
                            <p className="text-[10px] font-black uppercase text-white/20 mt-1 tracking-widest">Active Deck</p>
                        </div>

                        <button
                            onClick={() => { setIndex(i => Math.min(cards.length - 1, i + 1)); setIsFlipped(false); }}
                            disabled={index === cards.length - 1}
                            className="p-4 glass-card border-white/5 disabled:opacity-5 text-white/40 hover:text-white"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <button
                        onClick={() => setCards([])}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white font-syne italic"
                    >
                        <RotateCcw className="w-3 h-3" /> Purge Deck
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
