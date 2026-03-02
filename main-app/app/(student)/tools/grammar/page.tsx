'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckSquare,
    ArrowLeft,
    Send,
    Copy,
    Check,
    RotateCcw,
    Loader2,
    ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function GrammarFixPage() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleFix() {
        if (!input.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/tools/grammar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()
            setOutput(data.result)
        } catch (error) {
            toast.error("Grammar engine failed.")
        } finally {
            setLoading(false)
        }
    }

    const copy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        toast.success("Text corrected & copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckSquare className="w-6 h-6 text-emerald-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">Grammar <span className="text-emerald-500">Fix</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Professional tone correction, preserve your specific voice.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="glass-card p-2 border-white/10 focus-within:border-emerald-500/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste the original text..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 text-sm font-dm-sans italic min-h-[300px] placeholder:text-white/10"
                        />
                    </div>

                    <button
                        onClick={handleFix}
                        disabled={loading || !input.trim()}
                        className="btn-primary w-full py-4 bg-emerald-600 hover:bg-emerald-500 border-none shadow-emerald-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Scan & Correct <ShieldCheck className="w-4 h-4 ml-2" /></>}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic">Refined Output</h2>
                        {output && (
                            <button onClick={copy} className="text-[10px] font-bold text-emerald-500 hover:underline uppercase tracking-widest font-dm-sans flex items-center gap-2">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy Corrected'}
                            </button>
                        )}
                    </div>

                    <div className="glass-card min-h-[360px] p-10 relative group bg-emerald-500/[0.01]">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center space-y-4 opacity-20"
                                >
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Scanning Syntax...</p>
                                </motion.div>
                            ) : output ? (
                                <motion.div
                                    key="output"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="font-dm-sans text-sm leading-relaxed italic text-white/90 whitespace-pre-wrap"
                                >
                                    {output}
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-4">
                                    <CheckSquare className="w-12 h-12" />
                                    <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Neutral System Idle</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                    {output && (
                        <button
                            onClick={() => { setOutput(''); setInput(''); }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white mx-auto font-syne italic mt-2"
                        >
                            <RotateCcw className="w-3 h-3" /> Clear Module
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
