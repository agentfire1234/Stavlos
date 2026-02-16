'use client'

import { useState } from 'react'
import { Quote, ArrowLeft, Copy, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Style = 'APA' | 'MLA' | 'Chicago' | 'Harvard'

export default function CitationsPage() {
    const [source, setSource] = useState({
        author: '',
        title: '',
        year: '',
        publisher: '',
        url: ''
    })
    const [style, setStyle] = useState<Style>('APA')

    const generateCitation = () => {
        const { author, title, year, publisher, url } = source
        if (!title) return 'Enter source details to preview...'

        switch (style) {
            case 'APA':
                return `${author ? `${author}. ` : ''}(${year || 'n.d.'}). ${title}. ${publisher ? `${publisher}.` : ''} ${url ? `Available at: ${url}` : ''}`
            case 'MLA':
                return `${author ? `${author}. ` : ''}"${title}." ${publisher ? `${publisher}, ` : ''}${year || 'n.d.'}. ${url ? url : ''}`
            case 'Chicago':
                return `${author ? `${author}. ` : ''}${title}. ${publisher ? `${publisher}, ` : ''}${year || 'n.d.'}.`
            case 'Harvard':
                return `${author ? `${author} ` : ''}(${year || 'n.d.'}) ${title}. ${publisher ? `${publisher}.` : ''}`
            default:
                return ''
        }
    }

    const citation = generateCitation()

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Toolbox
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-2 italic">Citation Generator</h1>
                            <p className="text-white/40 font-medium">Automatic formatting for academic integrity.</p>
                        </div>
                        <Quote className="w-12 h-12 text-blue-500/20" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input Side */}
                    <div className="glass-card p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {(['APA', 'MLA', 'Chicago', 'Harvard'] as Style[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${style === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4">
                            <InputField label="Author" placeholder="e.g., J.K. Rowling" value={source.author} onChange={v => setSource({ ...source, author: v })} />
                            <InputField label="Title" placeholder="e.g., Harry Potter" value={source.title} onChange={v => setSource({ ...source, title: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Year" placeholder="2024" value={source.year} onChange={v => setSource({ ...source, year: v })} />
                                <InputField label="Publisher" placeholder="Bloomsbury" value={source.publisher} onChange={v => setSource({ ...source, publisher: v })} />
                            </div>
                            <InputField label="Source URL" placeholder="https://..." value={source.url} onChange={v => setSource({ ...source, url: v })} />
                        </div>
                    </div>

                    {/* Preview Side */}
                    <div className="space-y-8">
                        <section className="glass-card p-10 bg-blue-500/[0.02] border-blue-500/10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-8">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-blue-400">Preview ({style})</h2>
                                </div>
                                <p className="text-xl font-bold leading-relaxed selection:bg-blue-600">
                                    {citation}
                                </p>
                            </div>

                            <button
                                onClick={() => navigator.clipboard.writeText(citation)}
                                className="mt-12 w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy className="w-4 h-4" /> Copy Citation
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InputField({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all"
            />
        </div>
    )
}
