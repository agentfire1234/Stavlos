'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    Send,
    Paperclip,
    ArrowLeft,
    Sparkles,
    Calculator,
    CheckSquare,
    BookOpen,
    FileText,
    PenTool,
    Layers,
    MessageSquare,
    ArrowRight,
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

    const thinkingSteps = [
        mode === 'syllabus' ? "Searching knowledge..." : "Preparing request...",
        mode === 'syllabus' ? "Grounding in syllabus..." : "Processing...",
        "Generating response..."
    ]

    async function handleSend(e?: React.FormEvent) {
        e?.preventDefault()
        if (!input.trim() || isThinking) return

        const userMsg: ChatMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        const currentInput = input
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
                    message: currentInput,
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
            toast.error("Failed to get response. Try again.")
        } finally {
            clearInterval(interval)
            setIsThinking(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#111318] -m-6 md:-m-8 -mt-4">
                <div className="w-8 h-8 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-[#111318] overflow-hidden -m-6 md:-m-8 -mt-4 relative">
            {/* Top Bar */}
            <header className="h-[52px] border-b border-[#2d3139] px-4 flex items-center bg-[#111318] sticky top-0 z-10 font-syne">
                <Link href="/chat" className="p-2 text-[#64748b] hover:text-[#e2e8f0] transition-colors mr-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-[#e2e8f0] truncate max-w-[300px]">
                        {chat?.title || 'Untitled Session'}
                    </span>
                    <div className="h-4 w-[1px] bg-[#2d3139] mx-1" />
                    <span className="text-[12px] text-[#64748b] font-bold uppercase tracking-wider">
                        {mode} Mode
                    </span>
                </div>
            </header>

            {/* Messages Container */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto pt-10 pb-40 px-6 scroll-smooth">
                <div className="max-w-[760px] mx-auto space-y-8">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={msg.id || i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}>
                                    <div className={`p-4 rounded-2xl text-[14px] leading-[1.7] font-dm-sans ${msg.role === 'user'
                                        ? 'bg-[#1e2128] border border-[#2d3139] text-[#e2e8f0] rounded-tr-[4px]'
                                        : 'text-[#e2e8f0] bg-[#161b22] border border-[#2d3139] rounded-tl-[4px]'
                                        }`}>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {msg.content.replace(/\[FLASHCARD_SET:[^\]]+\]/g, '').trim()}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Render flashcard buttons if present */}
                                        {Array.from(msg.content.matchAll(/\[FLASHCARD_SET:([^\]]+)\]/g)).map((match, idx) => (
                                            <FlashcardPreview key={idx} id={match[1]} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isThinking && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-[#161b22] border border-[#2d3139] rounded-2xl rounded-tl-[4px] p-4 flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
                                    <span className="text-[12px] font-medium text-[#3b82f6]">{thinkingSteps[thinkingStep]}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Fixed Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#111318] via-[#111318]/90 tracking-tight">
                <div className="max-w-[760px] mx-auto bg-[#1e2128] border border-[#2d3139] rounded-xl p-3 focus-within:border-[#3d4351] transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Continue the conversation..."
                        rows={1}
                        className="w-full bg-transparent border-none outline-none resize-none px-2 py-1 text-[14px] text-[#e2e8f0] placeholder-[#64748b] min-h-[24px] max-h-40"
                    />
                    <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex items-center gap-2">
                            <button type="button" className="p-1.5 text-[#64748b] hover:text-[#e2e8f0] transition-colors rounded-md hover:bg-white/5">
                                <Paperclip className="w-[18px] h-[18px]" />
                            </button>
                            <div className="px-2 py-0.5 bg-[#161b22] text-[#64748b] text-[11px] font-medium rounded uppercase tracking-wider font-syne">
                                {mode} Mode
                            </div>
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${input.trim() && !isThinking ? 'bg-[#3b82f6] text-white shadow-lg' : 'bg-[#2d3139] text-[#64748b]'
                                }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FlashcardPreview({ id }: { id: string }) {
    return (
        <div className="mt-4 p-4 bg-[#1e2128] border border-[#f97316]/20 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center text-[#f97316]">
                    <Layers size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Flashcard Set Suggested</p>
                    <p className="text-[11px] text-slate-500 font-medium">Ready to master this material?</p>
                </div>
            </div>
            <Link
                href={`/flashcards/${id}`}
                className="h-9 px-4 bg-[#f97316] hover:bg-[#ea580c] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/10 active:scale-95"
            >
                Practice Now <ArrowRight size={14} />
            </Link>
        </div>
    )
}
