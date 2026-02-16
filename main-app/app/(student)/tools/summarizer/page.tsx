'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, FileText, ListChecks } from 'lucide-react'
import Link from 'next/link'

export default function SummarizerPage() {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState<string | null>(null)

    const summarize = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: `Please provide a concise TL;DR and key bullet points for this text: ${text}`,
                    taskType: 'summarizer'
                })
            })
            const data = await res.json()
            setSummary(data.response)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
                </Link>
                <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400">
                    Lightning Fast: Groq
                </div>
            </div>

            <div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
                    <FileText className="w-10 h-10 text-purple-500" />
                    Summarizer
                </h1>
                <p className="text-white/40 font-medium text-lg max-w-2xl">
                    TL;DR anything instantly. Paste long articles, textbook chapters, or notes to get the essential takeaways in seconds.
                </p>
            </div>

            {/* Input Area */}
            <form onSubmit={summarize} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                <div className="relative glass-card p-2 rounded-[2rem] flex flex-col gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your long text here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-lg placeholder:text-white/20 resize-none min-h-[200px]"
                    />
                    <div className="p-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-purple-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Summarize Now
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Results Area */}
            {summary && (
                <div className="glass-card p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-6 text-purple-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Master Summary</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                            {summary}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">CONCISE</span>
                            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">ACCURATE</span>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(summary)}
                            className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                        >
                            Copy Summary
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
