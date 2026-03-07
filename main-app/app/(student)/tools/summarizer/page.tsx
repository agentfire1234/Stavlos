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
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors font-syne">
                <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>

            <header className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Summarizer</h1>
                    <p className="text-[15px] font-medium text-[#94a3b8]">Condense any text into clear bullet points.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Input */}
                <div className="space-y-6">
                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-2 focus-within:border-blue-500/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste the text you want to condense..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 text-[15px] text-[#e2e8f0] min-h-[300px] placeholder:text-[#475569]"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['brief', 'standard', 'detailed'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLength(l)}
                                className={`flex-1 py-2 text-[12px] font-bold uppercase tracking-wider rounded-lg border transition-all ${length === l ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-[#1e2128] border-[#2d3139] text-[#64748b] hover:text-[#94a3b8] hover:bg-[#2d3139]'
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSummarize}
                        disabled={loading || !input.trim()}
                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-xl text-[14px] font-semibold text-[#111318] flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Summary <AlignLeft className="w-4 h-4" /></>}
                    </button>
                </div>

                {/* Right: Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Summary Result</h2>
                        {output && (
                            <button onClick={copy} className="text-[12px] font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-2 transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy output'}
                            </button>
                        )}
                    </div>

                    <div className="bg-[#1e2128] border border-[#2d3139] min-h-[420px] rounded-xl p-8 relative flex flex-col">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center space-y-4 text-[#475569]"
                                >
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <p className="text-[12px] font-semibold uppercase tracking-widest">Summarizing...</p>
                                </motion.div>
                            ) : output ? (
                                <motion.div
                                    key="output"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="prose prose-invert prose-sm max-w-none text-[#e2e8f0] leading-relaxed"
                                >
                                    <ReactMarkdown>{output}</ReactMarkdown>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center text-[#475569] space-y-4">
                                    <AlignLeft className="w-12 h-12 opacity-20" />
                                    <p className="text-[12px] font-semibold uppercase tracking-widest">Result will appear here</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
