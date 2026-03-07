'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    Send,
    Paperclip,
    ArrowLeft,
    ShieldCheck,
    Sparkles,
    Calculator,
    CheckSquare,
    BookOpen,
    FileText,
    PenTool,
    Layers,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

const MODE_ICONS: Record<string, any> = {
    general: Sparkles,
    syllabus: BookOpen,
    math: Calculator,
    grammar: CheckSquare,
    summary: FileText,
    essay: PenTool,
    flashcards: Layers,
}

interface ChatMessage {
    id?: string
    role: 'user' | 'assistant'
    content: string
    model_used?: string
    created_at?: string
}

export default function ChatConversationPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [chat, setChat] = useState<any>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [thinkingStep, setThinkingStep] = useState(0)
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    const supabase = createClient()

    useEffect(() => {
        loadConversation()
    }, [id])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isThinking])

    async function loadConversation() {
        setLoading(true)
        try {
            const res = await fetch(`/api/chat/${id}`)
            if (!res.ok) {
                toast.error('Conversation not found.')
                router.push('/chat')
                return
            }
            const data = await res.json()
            setChat(data.chat)
            setMessages(data.messages || [])
        } catch {
            toast.error('Failed to load conversation.')
            router.push('/chat')
        } finally {
            setLoading(false)
        }
    }

    const mode = chat?.mode || 'general'
    const ModeIcon = MODE_ICONS[mode] || Sparkles

    const thinkingSteps = [
        mode === 'syllabus' ? "🔍 Searching knowledge vault..." : "💭 Initializing neural path...",
        mode === 'syllabus' ? "📎 Context grounding active..." : "🧠 Processing request...",
        "✍️ Generating response..."
    ]

    async function handleSend(e?: React.FormEvent) {
        e?.preventDefault()
        if (!input.trim() || isThinking) return

        const userMsg: ChatMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsThinking(true)
        setThinkingStep(0)

        const interval = setInterval(() => {
            setThinkingStep(prev => (prev < 2 ? prev + 1 : prev))
        }, 1200)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    chatId: id,
                    mode,
                    syllabusId: chat?.syllabus_id || null,
                })
            })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()

            if (data.blocked) {
                toast.error(data.message || 'Request was blocked.')
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            }
        } catch {
            toast.error("Neural link interrupted. Try again.")
        } finally {
            clearInterval(interval)
            setIsThinking(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-3rem)] md:h-screen -m-6 md:-m-8 -mt-4 items-center justify-center">
                <div className="space-y-4 text-center opacity-30">
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 animate-spin border-t-blue-500 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">Loading session...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3rem)] md:h-screen -m-6 md:-m-8 -mt-4 bg-[#0a0a0f] overflow-hidden">

            {/* Header */}
            <header className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <Link href="/chat" className="p-2 text-white/20 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl glass-card border-blue-500/20 flex items-center justify-center">
                            <ModeIcon className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black font-syne uppercase italic tracking-wide truncate max-w-xs">
                                {chat?.title || 'Untitled Session'}
                            </h1>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-dm-sans">
                                {mode} mode · {messages.length} messages
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth pb-40">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="max-w-[85%] md:max-w-[70%] space-y-2">
                                <div className={`p-5 rounded-2xl font-dm-sans leading-relaxed text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10 italic font-bold'
                                    : 'glass-card border-white/5 text-white/80'
                                    }`}>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-right px-2">
                                    {msg.role === 'user' ? 'Student' : 'Stavlos AI'}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-start"
                        >
                            <div className="glass-card p-6 border-blue-500/20 max-w-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 animate-spin border-t-blue-500" />
                                        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-syne">{thinkingSteps[thinkingStep]}</p>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(dot => (
                                                <div key={dot} className={`w-1 h-1 rounded-full ${dot <= thinkingStep ? 'bg-blue-500' : 'bg-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Hub */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent">
                <div className="max-w-4xl mx-auto relative group">
                    <form
                        onSubmit={handleSend}
                        className="glass-card p-2 pr-4 border-white/10 group-focus-within:border-blue-500/50 transition-all flex items-end gap-2"
                    >
                        <button type="button" className="p-3 text-white/20 hover:text-white transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Continue the conversation..."
                            className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-sm font-dm-sans placeholder:text-white/10 min-h-[44px] max-h-40"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className={`p-3 rounded-xl transition-all ${input.trim() && !isThinking
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 hover:scale-110 active:scale-95'
                                : 'text-white/10'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
