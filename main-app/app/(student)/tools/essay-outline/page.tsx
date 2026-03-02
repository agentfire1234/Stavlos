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
    ChevronRight,
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
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-purple-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-purple-500/20 flex items-center justify-center mb-6">
                    <PenTool className="w-6 h-6 text-purple-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">Essay <span className="text-purple-500 text-glow-purple">Outliner</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Generate structured academic plans with PEEL and 5-paragraph frameworks.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-syne italic">Framework</label>
                        <div className="flex flex-col gap-2">
                            {['PEEL', '5-Paragraph', 'Argumentative', 'Compare'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStructure(s)}
                                    className={`w-full py-3 px-4 text-[9px] font-black uppercase tracking-widest font-syne italic rounded-xl border text-left transition-all flex items-center justify-between ${structure === s ? 'bg-purple-600/10 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/5 text-white/20 hover:text-white/40'
                                        }`}
                                >
                                    {s}
                                    {structure === s && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Textarea Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card p-2 border-white/10 focus-within:border-purple-500/50 transition-all">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Describe your essay topic in detail..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 text-sm font-dm-sans italic min-h-[160px] placeholder:text-white/10"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="btn-primary w-full py-4 bg-purple-600 hover:bg-purple-500 border-none shadow-purple-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Construct Infrastructure <Layout className="w-4 h-4 ml-2" /></>}
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
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic">Neural Infrastructure</h2>
                            <button onClick={copy} className="text-[10px] font-bold text-purple-500 hover:underline uppercase tracking-widest font-dm-sans flex items-center gap-2">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy Outline'}
                            </button>
                        </div>
                        <div className="glass-card p-12 relative group bg-purple-500/[0.01]">
                            <div className="prose prose-invert prose-sm max-w-none font-dm-sans leading-relaxed italic">
                                <ReactMarkdown>{outline}</ReactMarkdown>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOutline(''); setTopic(''); }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white mx-auto font-syne italic mt-2"
                        >
                            <RotateCcw className="w-3 h-3" /> Purge Outline
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
