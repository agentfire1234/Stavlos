'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calculator,
    ArrowLeft,
    Send,
    Copy,
    Check,
    RotateCcw,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function MathSolverPage() {
    const [input, setInput] = useState('')
    const [solution, setSolution] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleSolve() {
        if (!input.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/tools/math-solver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()
            setSolution(data.result)
        } catch (error) {
            toast.error("Math engine failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const copy = () => {
        navigator.clipboard.writeText(solution)
        setCopied(true)
        toast.success("Solution copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-amber-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-amber-500/20 flex items-center justify-center mb-6">
                    <Calculator className="w-6 h-6 text-amber-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">Math <span className="text-amber-500">Solver</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Paste any equation or word problem. Get every step explained.</p>
            </header>

            <div className="space-y-6">
                <div className="glass-card p-2 border-white/10 focus-within:border-amber-500/50 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your math problem here..."
                        className="w-full bg-transparent border-none outline-none resize-none p-4 text-sm font-dm-sans italic min-h-[160px] placeholder:text-white/10"
                    />
                </div>

                <button
                    onClick={handleSolve}
                    disabled={loading || !input.trim()}
                    className="btn-primary w-full py-4 bg-amber-600 hover:bg-amber-500 border-none shadow-amber-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Solve Step by Step <Send className="w-4 h-4 ml-2" /></>}
                </button>
            </div>

            <AnimatePresence>
                {solution && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic">Neural Solution</h2>
                            <button onClick={copy} className="text-[10px] font-bold text-amber-500 hover:underline uppercase tracking-widest font-dm-sans flex items-center gap-2">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy Full Workings'}
                            </button>
                        </div>
                        <div className="glass-card p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Calculator className="w-32 h-32 text-amber-500" />
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none font-dm-sans leading-loose relative z-10">
                                <ReactMarkdown>{solution}</ReactMarkdown>
                            </div>
                        </div>
                        <button
                            onClick={() => { setSolution(''); setInput(''); }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white mx-auto font-syne italic"
                        >
                            <RotateCcw className="w-3 h-3" /> Clear Module
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
