'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    Check,
    X,
    Layers,
    Brain,
    Trophy,
    Home,
    Command
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface Card {
    id: string
    front: string
    back: string
    card_index: number
}

interface SetData {
    id: string
    title: string
    card_count: number
    cards: Card[]
}

export default function FlashcardViewerPage({ params }: { params: { setId: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const { setId } = params

    // Data State
    const [set, setSet] = useState<SetData | null>(null)
    const [mode, setMode] = useState<'study' | 'review' | null>(null)
    const [dueCards, setDueCards] = useState<Card[]>([])

    // Session State
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [knownCards, setKnownCards] = useState<Set<string>>(new Set())
    const [reviewCards, setReviewCards] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)

    const fetchSet = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/flashcards/${setId}`)
            if (!response.ok) throw new Error('Failed to fetch set')
            const data = await response.json()
            setSet(data)

            // Check for due cards
            const { data: progress } = await supabase
                .from('flashcard_progress')
                .select('card_id')
                .eq('set_id', setId)
                .lte('next_review_at', new Date().toISOString())

            const dueIds = new Set((progress || []).map(p => p.card_id))
            const due = data.cards.filter((c: Card) => dueIds.has(c.id))
            setDueCards(due)
        } catch (err) {
            toast.error('Flashcard set not found')
            router.push('/flashcards')
        } finally {
            setIsLoading(false)
        }
    }, [setId, router, supabase])

    useEffect(() => {
        fetchSet()
    }, [fetchSet])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete || !mode) return

            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault()
                setIsFlipped(prev => !prev)
            } else if (e.code === 'ArrowLeft') {
                handlePrev()
            } else if (e.code === 'ArrowRight') {
                if (isFlipped) {
                    handleRate(4) // Assume "Got it" for right arrow in SM-2 mode
                } else {
                    handleNext()
                }
            } else if (e.key.toLowerCase() === 'k') {
                if (isFlipped) handleRate(4)
            } else if (e.key.toLowerCase() === 'r') {
                if (isFlipped) handleRate(1)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isComplete, mode, isFlipped])

    const activeCards = mode === 'review' ? dueCards : (set?.cards || [])
    const currentCard = activeCards[currentIndex]

    const handleNext = () => {
        if (currentIndex < activeCards.length - 1) {
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150)
        } else {
            setIsComplete(true)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150)
        }
    }

    const handleRate = async (quality: number) => {
        if (!currentCard) return

        if (quality >= 3) {
            setKnownCards(prev => new Set(prev).add(currentCard.id))
        } else {
            setReviewCards(prev => new Set(prev).add(currentCard.id))
        }

        // Save progress if in review mode or tracking SM-2
        try {
            await fetch('/api/flashcards/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId: currentCard.id, setId, quality })
            })
        } catch (e) {
            console.error('Failed to save progress:', e)
        }

        handleNext()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#111318] flex items-center justify-center">
                <Loader2 size={40} className="text-[#f97316] animate-spin" />
            </div>
        )
    }

    if (!set) return null

    // Mode Selection Screen
    if (!mode) {
        return (
            <div className="min-h-screen bg-[#111318] flex flex-col items-center justify-center p-6 bg-radial-at-t from-[#f97316]/5 to-transparent">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black font-syne text-white">{set.title}</h1>
                        <p className="text-slate-400 font-medium">How do you want to study?</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => setMode('study')}
                            className="glass-card p-6 text-left group hover:border-[#f97316]/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-[#f97316] transition-colors">Study All Cards</h3>
                                <Layers size={20} className="text-slate-500 group-hover:text-[#f97316]" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Go through all {set.card_count} cards in order. Perfect for initial learning.</p>
                        </button>

                        <button
                            disabled={dueCards.length === 0}
                            onClick={() => setMode('review')}
                            className={`glass-card p-6 text-left group transition-all ${dueCards.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#3b82f6]/50'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-lg font-bold ${dueCards.length > 0 ? 'text-white' : 'text-slate-600'}`}>Review Due Cards</h3>
                                <Brain size={20} className="text-slate-500" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                {dueCards.length > 0
                                    ? `Review ${dueCards.length} cards scheduled for today using spaced repetition.`
                                    : "You're all caught up! No cards in this set are due for review."}
                            </p>
                            {dueCards.length > 0 && <div className="mt-3 inline-flex px-2 py-0.5 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase rounded border border-[#3b82f6]/20">Recommended</div>}
                        </button>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="text-slate-500 hover:text-slate-300 font-bold text-sm"
                    >
                        ← Back to List
                    </button>
                </div>
            </div>
        )
    }

    // Completion Screen
    if (isComplete) {
        return (
            <div className="min-h-screen bg-[#111318] flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full glass-card p-10 text-center space-y-8"
                >
                    <div className="w-20 h-20 rounded-full bg-[#f97316]/10 flex items-center justify-center text-[#f97316] mx-auto">
                        <Trophy size={48} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black font-syne text-white">Session Complete!</h2>
                        <p className="text-slate-400 font-medium">Great job mastering your material.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="glass-card p-3 py-4 bg-white/5 border-none">
                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total</p>
                            <p className="text-lg font-black text-white">{activeCards.length}</p>
                        </div>
                        <div className="glass-card p-3 py-4 bg-[#10b981]/10 border-none">
                            <p className="text-[10px] uppercase font-bold text-[#10b981] mb-1">Got It</p>
                            <p className="text-lg font-black text-[#10b981]">{knownCards.size}</p>
                        </div>
                        <div className="glass-card p-3 py-4 bg-[#ef4444]/10 border-none">
                            <p className="text-[10px] uppercase font-bold text-[#ef4444] mb-1">Review</p>
                            <p className="text-lg font-black text-[#ef4444]">{reviewCards.size}</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        {reviewCards.size > 0 && (
                            <button
                                onClick={() => {
                                    setCurrentIndex(0)
                                    setMode('study')
                                    setIsComplete(false)
                                    setKnownCards(new Set())
                                    setReviewCards(new Set())
                                }}
                                className="w-full h-11 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all"
                            >
                                Retry Missed Cards
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setCurrentIndex(0)
                                setIsComplete(false)
                                setIsFlipped(false)
                                setKnownCards(new Set())
                                setReviewCards(new Set())
                            }}
                            className="w-full h-11 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/10"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={() => router.push('/flashcards')}
                            className="w-full text-slate-500 hover:text-slate-300 font-bold text-sm py-2"
                        >
                            Back to My Flashcards
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#111318] flex flex-col font-dm-sans">
            {/* Top Bar */}
            <div className="h-[52px] px-6 border-b border-[#2d3139] flex items-center justify-between bg-[#111318] z-20">
                <button onClick={() => setMode(null)} className="text-[#64748b] hover:text-[#e2e8f0] font-bold text-sm flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="text-center">
                    <span className="text-sm font-bold text-[#e2e8f0] font-syne truncate max-w-[200px] inline-block">{set.title}</span>
                    <span className="text-[#64748b] text-sm hidden sm:inline"> · Flashcards</span>
                </div>
                <div className="text-[#64748b] text-[13px] font-bold w-[60px] text-right">
                    {currentIndex + 1} / {activeCards.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-[#2d3139] w-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / activeCards.length) * 100}%` }}
                    className="h-full bg-[#f97316]"
                    transition={{ type: 'spring', damping: 20 }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">

                {/* 3D Card Container */}
                <div className="w-full max-w-[680px] h-[340px] perspective-1000 relative group">
                    <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full h-full relative cursor-pointer preserve-3d"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center shadow-2xl border-white/5">
                            <span className="absolute top-8 text-[10px] tracking-widest font-black text-slate-600 uppercase">Question</span>
                            <div className="text-xl sm:text-2xl font-black font-syne text-[#e2e8f0] leading-tight overflow-y-auto max-h-full py-4">
                                {currentCard?.front}
                            </div>
                            <span className="absolute bottom-8 text-[11px] font-bold text-slate-500 animate-pulse">Click to reveal answer</span>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center shadow-2xl border-[#3b82f6]/20 bg-[#1a2540]/80 rotate-y-180">
                            <span className="absolute top-8 text-[10px] tracking-widest font-black text-[#3b82f6] uppercase">Answer</span>
                            <div className="text-base sm:text-lg font-medium text-[#e2e8f0] leading-relaxed overflow-y-auto max-h-full py-10">
                                {currentCard?.back}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Controls Area */}
                <div className="w-full max-w-[680px] space-y-6">
                    {/* Basic Nav */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            disabled={currentIndex === 0}
                            onClick={handlePrev}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[#2d3139] transition-all ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="px-8 h-12 bg-white/5 border border-[#2d3139] rounded-xl font-bold text-slate-200 hover:bg-white/10 hover:border-slate-500 transition-all min-w-[160px]"
                        >
                            {isFlipped ? "Show Question" : "Show Answer"}
                        </button>

                        <button
                            disabled={currentIndex === activeCards.length - 1 && !isFlipped}
                            onClick={handleNext}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[#2d3139] transition-all ${currentIndex === activeCards.length - 1 && !isFlipped ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Quality Rating (Visible only when answer is showing) */}
                    <AnimatePresence>
                        {isFlipped && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3"
                            >
                                <button
                                    onClick={() => handleRate(1)}
                                    className="flex-1 h-[52px] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl text-[#ef4444] font-black flex items-center justify-center gap-2 hover:bg-[#ef4444]/20 transition-all active:scale-95 group"
                                >
                                    <X size={20} className="group-hover:rotate-12 transition-transform" /> Review Again
                                </button>
                                <button
                                    onClick={() => handleRate(4)}
                                    className="flex-1 h-[52px] bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl text-[#10b981] font-black flex items-center justify-center gap-2 hover:bg-[#10b981]/20 transition-all active:scale-95 group"
                                >
                                    <Check size={20} className="group-hover:scale-110 transition-transform" /> Got it
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Keyboard Help */}
                    <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-[#475569] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><Command size={10} /> Shift or Space to flip</div>
                        <div className="h-3 w-px bg-[#2d3139]" />
                        <div className="flex items-center gap-1.5">← → to navigate</div>
                        <div className="h-3 w-px bg-[#2d3139]" />
                        <div className="flex items-center gap-1.5">K: know it · R: review</div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    )
}

function Loader2({ ...props }) {
    return <motion.div {...props}><RotateCcw /></motion.div>
}
