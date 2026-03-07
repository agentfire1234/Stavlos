'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookMarked,
    ArrowLeft,
    Send,
    Copy,
    Check,
    RotateCcw,
    Loader2,
    Plus,
    Book
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CitationPage() {
    const [form, setForm] = useState({
        type: 'web',
        author: '',
        title: '',
        year: '',
        publisher: '',
        url: ''
    })
    const [style, setStyle] = useState('APA')
    const [citation, setCitation] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    function handleGenerate() {
        setLoading(true)
        setTimeout(() => {
            let res = ""
            if (style === 'APA') {
                res = `${form.author} (${form.year}). ${form.title}. ${form.publisher}. ${form.url}`
            } else if (style === 'MLA') {
                res = `${form.author}. "${form.title}." ${form.publisher}, ${form.year}, ${form.url}.`
            } else {
                res = `${form.author}. ${form.title}. ${form.publisher}, ${form.year}.`
            }
            setCitation(res)
            setLoading(false)
        }, 800)
    }

    const copy = () => {
        navigator.clipboard.writeText(citation)
        setCopied(true)
        toast.success("Citation copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#e2e8f0] transition-colors font-syne">
                <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>

            <header className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-pink-500" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Citation Generator</h1>
                    <p className="text-[15px] font-medium text-[#94a3b8]">APA, MLA, Chicago — formatted instantly with zero friction.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider px-1">Source Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] outline-none focus:border-pink-500/50 transition-all font-medium"
                            >
                                <option value="web">Website</option>
                                <option value="book">Book</option>
                                <option value="journal">Journal</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider px-1">Style Convention</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] outline-none focus:border-pink-500/50 transition-all font-medium"
                            >
                                <option value="APA">APA 7th</option>
                                <option value="MLA">MLA 9th</option>
                                <option value="Chicago">Chicago</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input
                            placeholder="Author Name (Last, First)"
                            value={form.author}
                            onChange={(e) => setForm({ ...form, author: e.target.value })}
                            className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-pink-500/50 transition-all font-medium"
                        />
                        <input
                            placeholder="Source Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-pink-500/50 transition-all font-medium"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Year"
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-pink-500/50 transition-all font-medium"
                            />
                            <input
                                placeholder="Publisher / Site"
                                value={form.publisher}
                                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                                className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-pink-500/50 transition-all font-medium"
                            />
                        </div>
                        <input
                            placeholder="URL (Optional)"
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                            className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-pink-500/50 transition-all font-medium"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !form.title}
                        className="w-full h-12 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 rounded-xl text-[14px] font-semibold text-[#111318] flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/10"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Citation <Plus className="w-4 h-4" /></>}
                    </button>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#64748b] px-1">Citation Result</h2>
                    <div className="bg-[#1e2128] border border-[#2d3139] min-h-[300px] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6">
                        {citation ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">
                                <div className="p-6 bg-[#111318] border border-pink-500/10 rounded-xl">
                                    <p className="font-mono text-[13px] text-pink-400 leading-relaxed select-all">
                                        {citation}
                                    </p>
                                </div>
                                <button
                                    onClick={copy}
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[13px] font-semibold text-[#e2e8f0] transition-all flex items-center gap-2 mx-auto"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy Citation'}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="opacity-20 space-y-4">
                                <BookMarked className="w-12 h-12 mx-auto text-[#64748b]" />
                                <p className="text-[12px] font-semibold uppercase tracking-widest">Complete form to generate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
