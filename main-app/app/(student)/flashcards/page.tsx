'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Layers,
    Plus,
    Search,
    Trash2,
    Play,
    Clock,
    MoreVertical,
    Calendar,
    ChevronRight,
    Brain,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-hot-toast'

export default function FlashcardsPage() {
    const [sets, setSets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchSets()
    }, [])

    async function fetchSets() {
        try {
            const res = await fetch('/api/flashcards/sets')
            if (!res.ok) throw new Error('Failed to load flashcards')
            const data = await res.json()
            setSets(data)
        } catch (err) {
            toast.error('Failed to load your flashcards')
        } finally {
            setLoading(false)
        }
    }

    async function deleteSet(id: string, e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Are you sure you want to delete this flashcard set?')) return

        try {
            const res = await fetch(`/api/flashcards/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')

            setSets(prev => prev.filter(s => s.id !== id))
            toast.success('Set deleted successfully')
        } catch (err) {
            toast.error('Failed to delete set')
        }
    }

    const filteredSets = sets.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-white/5 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-44 bg-white/5 rounded-2xl border border-white/5" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black font-syne text-[#e2e8f0]">My Flashcards</h1>
                    <p className="text-slate-400 font-medium">Manage and review your AI-generated study sets.</p>
                </div>

                <Link
                    href="/tools/flashcards"
                    className="h-11 px-6 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/10 active:scale-95 transition-all"
                >
                    <Plus size={18} /> New Set
                </Link>
            </header>

            {/* toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search your sets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#f97316]/50 transition-all outline-none font-medium text-sm"
                    />
                </div>
                {sets.length > 0 && (
                    <div className="flex items-center gap-2 px-4 h-11 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl text-[#3b82f6] text-sm font-bold">
                        <Brain size={16} /> {sets.length} active sets
                    </div>
                )}
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {filteredSets.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredSets.map((set) => (
                            <motion.div
                                key={set.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Link
                                    href={`/flashcards/${set.id}`}
                                    className="group block glass-card p-6 h-full border-white/5 hover:border-[#f97316]/30 transition-all relative overflow-hidden"
                                >
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-[#f97316] group-hover:scale-110 transition-transform">
                                                <Layers size={20} />
                                            </div>
                                            <button
                                                onClick={(e) => deleteSet(set.id, e)}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-[#f97316] transition-colors truncate">
                                                {set.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <span>{set.card_count} cards</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span>{set.source}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between border-t border-white/5 text-[11px] font-bold text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {formatDistanceToNow(new Date(set.created_at))} ago
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${set.days_remaining <= 5 ? 'text-amber-500' : ''}`}>
                                                <Clock size={12} />
                                                {set.days_remaining}d left
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center translate-x-12 group-hover:translate-x-0 transition-transform shadow-lg shadow-orange-500/20">
                                        <Play size={14} className="fill-current ml-0.5" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                            <Layers size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white">No flashcard sets found</h2>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try a different search term.`
                                    : "You haven't generated any flashcards yet. Start by turning your notes into active recall sets."}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Link
                                href="/tools/flashcards"
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all"
                            >
                                Generate your first set
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
