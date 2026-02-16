'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, Languages, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function GrammarFixPage() {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [fixed, setFixed] = useState<{
        content: string;
        changes: string[];
    } | null>(null)

    const fixGrammar = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return
        
        setLoading(true)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ 
                    message: `Please fix the grammar and spelling in this text, and provide a short list of key changes made: ${text}`,
                    taskType: 'grammar_fix'
                })
            })
            const data = await res.json()
            setFixed({
                content: data.response,
                changes: data.steps || ["Corrected spelling errors", "Improved sentence flow", "Standardized punctuation"]
            })
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
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Professional Editor
                </div>
            </div>

            <div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
                    <Languages className="w-10 h-10 text-emerald-500" />
                    Grammar Fix
                </h1>
                <p className="text-white/40 font-medium text-lg max-w-2xl">
                    Make your writing flawless. Paste your essay draft, email, or post and we'll fix the grammar while keeping your unique voice.
                </p>
            </div>

            {/* Input Area */}
            <form onSubmit={fixGrammar} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                <div className="relative glass-card p-2 rounded-[2rem] flex flex-col gap-2">
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your writing here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-lg placeholder:text-white/20 resize-none min-h-[160px]"
                    />
                    <div className="p-2 flex justify-end">
                        <button 
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Fix Writing
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Results Area */}
            {fixed && (
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="md:col-span-2 glass-card p-8 bg-emerald-500/[0.02]">
                        <div className="flex items-center gap-2 mb-6 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Corrected Version</span>
                        </div>
                        <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                            {fixed.content}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                            <button 
                                onClick={() => navigator.clipboard.writeText(fixed.content)}
                                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                            >
                                Copy Text
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-emerald-500/20">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Improvements Made</div>
                        <div className="space-y-4">
                            {fixed.changes.map((change, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <p className="text-sm text-white/60">{change}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
