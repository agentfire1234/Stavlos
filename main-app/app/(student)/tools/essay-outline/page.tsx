'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PenTool,
    ArrowLeft,
    Send,
    Copy,
    Check,
    RotateCcw,
    Loader2,
    Layout
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function EssayOutlinerPage() {
    const [topic, setTopic] = useState('')
    const [structure, setStructure] = useState('PEEL')
    const [outline, setOutline] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleGenerate() {
        if (!topic.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/tools/essay-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, structure })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()
            setOutline(data.result)
        } catch (error) {
            toast.error("Outline generator failed.")
        } finally {
            setLoading(false)
        }
    }

    const copy = () => {
        navigator.clipboard.writeText(outline)
        setCopied(true)
        toast.success("Outline copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors font-syne">
                <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>

            <header className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-purple-500" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Essay Outliner</h1>
                    <p className="text-[15px] font-medium text-[#94a3b8]">Generate structured academic plans with PEEL and 5-paragraph frameworks.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-8">
                {/* Inputs */}
                <aside className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Framework</label>
                        <div className="space-y-1.5">
                            {['PEEL', '5-Paragraph', 'Argumentative', 'Compare'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStructure(s)}
                                    className={`w-full py-2.5 px-3.5 text-[13px] font-semibold rounded-lg border text-left transition-all flex items-center justify-between ${structure === s ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/5 text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/10'
                                        }`}
                                >
                                    {s}
                                    {structure === s && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Textarea Area */}
                <div className="space-y-6">
                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-2 focus-within:border-purple-500/50 transition-all">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Describe your essay topic in detail..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 text-[15px] text-[#e2e8f0] min-h-[180px] placeholder:text-[#475569]"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="w-full h-12 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 rounded-xl text-[14px] font-semibold text-[#111318] flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/10"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Outline <Layout className="w-4 h-4" /></>}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {outline && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Essay Outline</h2>
                            <button onClick={copy} className="text-[12px] font-semibold text-purple-500 hover:text-purple-400 flex items-center gap-2 transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy outline'}
                            </button>
                        </div>
                        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-10 relative group bg-purple-500/[0.01]">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <PenTool className="w-32 h-32 text-purple-500" />
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none text-[#e2e8f0] leading-relaxed relative z-10">
                                <ReactMarkdown>{outline}</ReactMarkdown>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOutline(''); setTopic(''); }}
                            className="flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] mx-auto transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset and clear
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
