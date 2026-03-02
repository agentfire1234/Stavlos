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
        toast.success("Citation adapted.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
            <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-pink-500 transition-colors font-syne italic">
                <ArrowLeft className="w-3 h-3" /> Back to Toolbox
            </Link>

            <header className="space-y-2">
                <div className="w-12 h-12 rounded-2xl glass-card border-pink-500/20 flex items-center justify-center mb-6">
                    <BookMarked className="w-6 h-6 text-pink-500" />
                </div>
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tight">Citation <span className="text-pink-500">Generator</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">APA, MLA, Chicago — formatted instantly with zero friction.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="glass-card p-10 space-y-8 bg-pink-500/[0.01]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 font-syne italic">Source Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-syne italic outline-none focus:border-pink-500/50"
                            >
                                <option value="web">Website</option>
                                <option value="book">Book</option>
                                <option value="journal">Journal</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 font-syne italic">Style Convention</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-syne italic outline-none focus:border-pink-500/50"
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold font-dm-sans italic focus:border-pink-500/50 outline-none placeholder:text-white/10"
                        />
                        <input
                            placeholder="Source Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold font-dm-sans italic focus:border-pink-500/50 outline-none placeholder:text-white/10"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Year"
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold font-dm-sans italic focus:border-pink-500/50 outline-none placeholder:text-white/10"
                            />
                            <input
                                placeholder="Publisher / Site"
                                value={form.publisher}
                                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold font-dm-sans italic focus:border-pink-500/50 outline-none placeholder:text-white/10"
                            />
                        </div>
                        <input
                            placeholder="URL (Optional)"
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold font-dm-sans italic focus:border-pink-500/50 outline-none placeholder:text-white/10"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !form.title}
                        className="btn-primary w-full py-4 bg-pink-600 hover:bg-pink-500 border-none shadow-pink-500/20 text-sm font-black uppercase tracking-[0.3em] font-syne italic"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Scale Citation <Plus className="w-4 h-4 ml-2" /></>}
                    </button>
                </div>

                {/* Output */}
                <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic px-2">Generated Protocol</h2>
                    <div className="glass-card min-h-[300px] p-12 flex flex-col items-center justify-center text-center space-y-6">
                        {citation ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <p className="font-mono text-sm text-pink-400 leading-relaxed italic select-all p-6 glass-card border-pink-500/10">
                                    {citation}
                                </p>
                                <button onClick={copy} className="btn-secondary py-3 px-8 text-[9px] font-black uppercase tracking-widest font-syne italic">
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} {copied ? 'Integrated' : 'Copy Citation'}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="opacity-10 space-y-4">
                                <BookMarked className="w-12 h-12 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Protocol Pending</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
