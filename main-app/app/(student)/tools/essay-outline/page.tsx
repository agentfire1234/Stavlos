'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, Layout, ListChecks } from 'lucide-react'
import Link from 'next/link'

export default function EssayOutlinePage() {
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(false)
    const [outline, setOutline] = useState<string | null>(null)

    const generateOutline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!topic.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: `Please generate a detailed essay outline for this topic, including a strong thesis statement and PEEL-method points for body paragraphs: ${topic}`,
                    taskType: 'essay_outline'
                })
            })
            const data = await res.json()
            setOutline(data.response)
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
                <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest text-orange-400">
                    High Structure: GPT-4o
                </div>
            </div>

            <div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
                    <Layout className="w-10 h-10 text-orange-500" />
                    Essay Outliner
                </h1>
                <p className="text-white/40 font-medium text-lg max-w-2xl">
                    Kill writer's block. Provide your essay prompt or topic, and we'll build a structured roadmap with thesis, arguments, and evidence.
                </p>
            </div>

            {/* Input Area */}
            <form onSubmit={generateOutline} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                <div className="relative glass-card p-2 rounded-[2rem] flex flex-col gap-2">
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="What are you writing about? (e.g. The impact of the industrial revolution on urban families)..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-lg placeholder:text-white/20 resize-none min-h-[140px]"
                    />
                    <div className="p-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !topic.trim()}
                            className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-orange-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Build Outline
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Results Area */}
            {outline && (
                <div className="glass-card p-8 animate-in fade-in slide-in-from-top-4 duration-500 bg-orange-500/[0.01]">
                    <div className="flex items-center gap-2 mb-6 text-orange-400">
                        <ListChecks className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Essay Roadmap</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div className="text-white/90 text-sm leading-loose font-medium whitespace-pre-wrap">
                            {outline}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/20 uppercase">Structured using PEEL Method</span>
                        <button
                            onClick={() => navigator.clipboard.writeText(outline)}
                            className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                        >
                            Copy Outline
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
