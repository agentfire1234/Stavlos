'use client'

import { useState } from 'react'
import { Brain, ArrowLeft, RefreshCw, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Flashcard {
    id: string
    front: string
    back: string
}

export default function FlashcardsPage() {
    const [input, setInput] = useState('')
    const [cards, setCards] = useState<Flashcard[]>([])
    const [generating, setGenerating] = useState(false)
    const [viewMode, setViewMode] = useState<'edit' | 'study'>('edit')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)

    async function generateCards() {
        if (!input.trim()) return
        setGenerating(true)
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: `Generate 5 study flashcards (Front/Back) based on this text:\n\n${input}`,
                    taskType: 'flashcard'
                })
            })
            const data = await response.json()

            // Basic parsing of AI response (expecting Front: / Back: format)
            const lines = data.response.split('\n').filter((l: string) => l.includes(':'))
            const newCards: Flashcard[] = []

            for (let i = 0; i < lines.length; i += 2) {
                if (lines[i] && lines[i + 1]) {
                    newCards.push({
                        id: Math.random().toString(36).substr(2, 9),
                        front: lines[i].split(':')[1].trim(),
                        back: lines[i + 1].split(':')[1].trim()
                    })
                }
            }
            setCards([...cards, ...newCards])
            setInput('')
        } catch (e) {
            console.error(e)
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Toolbox
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-2 italic">Flashcard Generator</h1>
                            <p className="text-white/40 font-medium">Turn notes into active recall sets in seconds.</p>
                        </div>
                        <Brain className="w-12 h-12 text-purple-500/20" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Input Side */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30">Paste Notes</h2>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste a paragraph or key concepts..."
                                className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                            />
                            <button
                                onClick={generateCards}
                                disabled={generating || !input.trim()}
                                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-50 transition-all disabled:opacity-50"
                            >
                                {generating ? 'Thinking...' : 'Generate Set'}
                            </button>
                        </div>

                        {cards.length > 0 && (
                            <button
                                onClick={() => setViewMode(viewMode === 'edit' ? 'study' : 'edit')}
                                className="w-full border border-white/5 bg-white/[0.02] py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.05] transition-all"
                            >
                                {viewMode === 'edit' ? 'Start Studying' : 'Back to Edit'}
                            </button>
                        )}
                    </div>

                    {/* Display Side */}
                    <div className="lg:col-span-2">
                        {viewMode === 'edit' ? (
                            <div className="space-y-4">
                                {cards.length === 0 ? (
                                    <div className="h-64 border border-dashed border-white/10 rounded-3xl flex items-center justify-center">
                                        <p className="text-white/20 text-xs font-black uppercase tracking-widest">No cards generated yet</p>
                                    </div>
                                ) : (
                                    cards.map(card => (
                                        <div key={card.id} className="glass-card p-6 flex justify-between gap-6 group">
                                            <div className="space-y-2 flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Question</p>
                                                <p className="text-sm font-bold">{card.front}</p>
                                                <div className="h-px bg-white/5 w-full" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Answer</p>
                                                <p className="text-sm text-white/50">{card.back}</p>
                                            </div>
                                            <button
                                                onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div
                                    onClick={() => setFlipped(!flipped)}
                                    className="perspective-1000 cursor-pointer h-72"
                                >
                                    <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
                                        {/* Front */}
                                        <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-6">Question</p>
                                            <h2 className="text-2xl font-black">{cards[currentIndex]?.front}</h2>
                                            <p className="mt-12 text-[10px] font-black uppercase text-white/20">Tap to Reveal</p>
                                        </div>
                                        {/* Back */}
                                        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-12 flex flex-col items-center justify-center text-center border-purple-500/20 bg-purple-500/[0.02]">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Answer</p>
                                            <h2 className="text-xl font-bold leading-relaxed">{cards[currentIndex]?.back}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-12">
                                    <button
                                        disabled={currentIndex === 0}
                                        onClick={() => { setCurrentIndex(currentIndex - 1); setFlipped(false) }}
                                        className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white disabled:opacity-20 transition-all"
                                    >
                                        Previous
                                    </button>
                                    <p className="text-[10px] font-black font-mono text-white/20">
                                        {currentIndex + 1} OF {cards.length}
                                    </p>
                                    <button
                                        disabled={currentIndex === cards.length - 1}
                                        onClick={() => { setCurrentIndex(currentIndex + 1); setFlipped(false) }}
                                        className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 disabled:opacity-20 transition-all"
                                    >
                                        Next Card
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
