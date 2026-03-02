'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    ArrowLeft,
    Send,
    Copy,
    Check,
    RotateCcw,
    Loader2,
    AlignLeft
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function SummarizerPage() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [length, setLength] = useState('standard')

    async function handleSummarize() {
        if (!input.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/tools/summarizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input, length })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()
            setOutput(data.result)
        } catch (error) {
            toast.error("Summarization engine failed.")
        } finally {
            setLoading(false)
        }
    }

    const copy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        toast.success("Summary copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-blue-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-blue-500/20 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">The <span className="text-blue-500 text-glow-blue">Summarizer</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Condense any text into clear bullet points.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Input */}
                <div className="space-y-6">
                    <div className="glass-card p-2 border-white/10 focus-within:border-blue-500/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste the text you want to condense..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 text-sm font-dm-sans italic min-h-[300px] placeholder:text-white/10"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['brief', 'standard', 'detailed'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLength(l)}
                                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest font-syne italic rounded-lg border transition-all ${length === l ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-white/20 hover:text-white/40'
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSummarize}
                        disabled={loading || !input.trim()}
                        className="btn-primary w-full py-4 bg-blue-600 hover:bg-blue-500 border-none shadow-blue-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Summary <AlignLeft className="w-4 h-4 ml-2" /></>}
                    </button>
                </div>

                {/* Right: Output */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic">Condensed Output</h2>
                        {output && (
                            <button onClick={copy} className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest font-dm-sans flex items-center gap-2">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy Content'}
                            </button>
                        )}
                    </div>

                    <div className="glass-card min-h-[420px] p-10 relative group">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center space-y-4 opacity-20"
                                >
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Distilling Logic...</p>
                                </motion.div>
                            ) : output ? (
                                <motion.div
                                    key="output"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="prose prose-invert prose-sm max-w-none font-dm-sans leading-relaxed italic"
                                >
                                    <ReactMarkdown>{output}</ReactMarkdown>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-4">
                                    <AlignLeft className="w-12 h-12" />
                                    <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Output Pending</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
