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
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors font-syne">
                <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>

            <header className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Math Solver</h1>
                    <p className="text-[15px] font-medium text-[#94a3b8]">Paste any equation or word problem. Get every step explained.</p>
                </div>
            </header>

            <div className="space-y-6">
                <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-2 focus-within:border-amber-500/50 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your math problem here..."
                        className="w-full bg-transparent border-none outline-none resize-none p-4 text-[15px] text-[#e2e8f0] min-h-[160px] placeholder:text-[#475569]"
                    />
                </div>

                <button
                    onClick={handleSolve}
                    disabled={loading || !input.trim()}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500 rounded-xl text-[14px] font-semibold text-[#111318] flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Solve step-by-step <Send className="w-4 h-4" /></>}
                </button>
            </div>

            <AnimatePresence>
                {solution && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Solution</h2>
                            <button onClick={copy} className="text-[12px] font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-2 transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy workings'}
                            </button>
                        </div>
                        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <Calculator className="w-32 h-32 text-amber-500" />
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none text-[#e2e8f0] leading-relaxed relative z-10">
                                <ReactMarkdown>{solution}</ReactMarkdown>
                            </div>
                        </div>
                        <button
                            onClick={() => { setSolution(''); setInput(''); }}
                            className="flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] mx-auto transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Clear and solve another
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
