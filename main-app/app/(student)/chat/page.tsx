'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    Send,
    Paperclip,
    Plus,
    Search,
    MessageSquare,
    Calculator,
    CheckSquare,
    BookOpen,
    FileText,
    PenTool,
    Layers,
    ShieldCheck,
    Sparkles
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

const MODES = [
    { id: 'general', label: 'General', icon: Sparkles },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'math', label: 'Math', icon: Calculator },
    { id: 'grammar', label: 'Grammar', icon: CheckSquare },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'essay', label: 'Essay', icon: PenTool },
    { id: 'flashcards', label: 'Cards', icon: Layers },
]

interface ChatMessage {
    id?: string
    role: 'user' | 'assistant'
    content: string
    model_used?: string
    created_at?: string
}

interface ChatItem {
    id: string
    title: string
    mode: string
    created_at: string
    updated_at: string
}

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString()
}

function ChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [activeMode, setActiveMode] = useState('general')
    const [syllabuses, setSyllabuses] = useState<any[]>([])
    const [selectedSyllabus, setSelectedSyllabus] = useState<string>('')
    const [isThinking, setIsThinking] = useState(false)
    const [thinkingStep, setThinkingStep] = useState(0)
    const [chatId, setChatId] = useState<string | null>(null)
    const [chatHistory, setChatHistory] = useState<ChatItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const supabase = createClient()

    useEffect(() => {
        loadSyllabuses()
        loadChatHistory()

        // Check if a syllabus context was passed via URL
        const contextId = searchParams.get('context')
        if (contextId) {
            setActiveMode('syllabus')
            setSelectedSyllabus(contextId)
        }
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isThinking])

    async function loadSyllabuses() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('syllabuses')
                .select('*')
                .eq('user_id', user.id)
            setSyllabuses(data || [])
            if (data?.length && !selectedSyllabus) setSelectedSyllabus(data[0].id)
        }
    }

    async function loadChatHistory() {
        try {
            const res = await fetch('/api/chat/list')
            if (res.ok) {
                const data = await res.json()
                setChatHistory(data)
            }
        } catch { /* silent */ }
    }

    async function loadChat(id: string) {
        try {
            const res = await fetch(`/api/chat/${id}`)
            if (res.ok) {
                const data = await res.json()
                setChatId(id)
                setMessages(data.messages || [])
                if (data.chat?.mode) setActiveMode(data.chat.mode)
                if (data.chat?.syllabus_id) setSelectedSyllabus(data.chat.syllabus_id)
            }
        } catch {
            toast.error('Failed to load conversation.')
        }
    }

    function startNewChat() {
        setChatId(null)
        setMessages([])
        setActiveMode('general')
    }

    const thinkingSteps = [
        activeMode === 'syllabus' ? "🔍 Searching knowledge vault..." : "💭 Initializing neural path...",
        activeMode === 'syllabus' ? "📎 Context grounding active..." : "🧠 Processing request...",
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
                    chatId,
                    mode: activeMode,
                    syllabusId: activeMode === 'syllabus' ? selectedSyllabus : null,
                })
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Request failed')
            }
            const data = await res.json()

            if (data.blocked) {
                toast.error(data.message || 'Request was blocked.')
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            }

            // Track chatId for subsequent messages
            if (data.chatId && !chatId) {
                setChatId(data.chatId)
                loadChatHistory() // Refresh sidebar
            }
        } catch (error: any) {
            toast.error(error.message || "Stavlos Neural Link interrupted. Try again.")
        } finally {
            clearInterval(interval)
            setIsThinking(false)
        }
    }

    const filteredHistory = searchQuery
        ? chatHistory.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        : chatHistory

    // Group chats by date
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const todayChats = filteredHistory.filter(c => new Date(c.updated_at).toDateString() === today)
    const yesterdayChats = filteredHistory.filter(c => new Date(c.updated_at).toDateString() === yesterday)
    const olderChats = filteredHistory.filter(c => {
        const d = new Date(c.updated_at).toDateString()
        return d !== today && d !== yesterday
    })

    return (
        <div className="flex h-[calc(100vh-3rem)] md:h-screen bg-[#0a0a0f] overflow-hidden -m-6 md:-m-8 -mt-4">

            {/* Left Desktop History Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 border-r border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="p-6 space-y-4">
                    <button
                        onClick={startNewChat}
                        className="btn-primary w-full py-2.5 text-xs font-syne uppercase tracking-widest italic group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Session
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find session..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-dm-sans placeholder:text-white/10 focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
                    {todayChats.length > 0 && (
                        <ChatGroup label="Today" chats={todayChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                    {yesterdayChats.length > 0 && (
                        <ChatGroup label="Yesterday" chats={yesterdayChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                    {olderChats.length > 0 && (
                        <ChatGroup label="Earlier" chats={olderChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                    {filteredHistory.length === 0 && (
                        <div className="text-center py-12 space-y-3 opacity-30">
                            <MessageSquare className="w-8 h-8 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest font-syne italic">
                                {searchQuery ? 'No matches' : 'No sessions yet'}
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative">

                {/* Top Nav / Mode Selector */}
                <header className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 backdrop-blur-md z-10">
                    <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                        {MODES.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeMode === mode.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-white/30 hover:text-white/60'
                                    }`}
                            >
                                <mode.icon className="w-3 h-3" />
                                <span className="font-syne italic">{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeMode === 'syllabus' && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-white/20 uppercase font-syne italic">Context:</span>
                            <select
                                value={selectedSyllabus}
                                onChange={(e) => setSelectedSyllabus(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest outline-none focus:border-blue-500/50"
                            >
                                {syllabuses.map(s => (
                                    <option key={s.id} value={s.id}>{s.course_name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </header>

                {/* Messages Panel */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth pb-40">
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 py-20"
                            >
                                <div className="w-20 h-20 rounded-[2.5rem] glass-card border-blue-500/30 flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black font-syne uppercase italic tracking-widest">Neural Link Idle</h2>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Ready to assist your academic journey</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 max-w-sm">
                                    {["Summarize notes", "Explain concepts", "Math help", "Essay outline"].map(chip => (
                                        <button
                                            key={chip}
                                            onClick={() => { setInput(chip); }}
                                            className="px-4 py-2 glass-card hover:border-blue-500/50 text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

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
                                placeholder="Ask anything about your courses..."
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
                        <div className="mt-4 flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 font-syne">Mode: {activeMode}</span>
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-white/10 uppercase tracking-widest font-syne italic">Stavlos AI</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-3rem)]">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 animate-spin border-t-blue-500" />
            </div>
        }>
            <ChatClient />
        </Suspense>
    )
}

function ChatGroup({ label, chats, activeChatId, onSelect }: {
    label: string
    chats: ChatItem[]
    activeChatId: string | null
    onSelect: (id: string) => void
}) {
    return (
        <section className="space-y-2">
            <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic">{label}</h3>
            <div className="space-y-1">
                {chats.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => onSelect(chat.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl group transition-all border ${chat.id === activeChatId
                            ? 'bg-white/5 border-blue-500/20'
                            : 'border-transparent hover:bg-white/5 hover:border-white/5'
                            }`}
                    >
                        <p className={`text-xs font-bold truncate font-dm-sans italic ${chat.id === activeChatId ? 'text-blue-400' : 'text-white/60 group-hover:text-blue-400'}`}>
                            {chat.title || 'Untitled Session'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-white/20 font-black uppercase tracking-tighter">{chat.mode} Mode</span>
                            <span className="text-[9px] text-white/10">·</span>
                            <span className="text-[9px] text-white/15 font-dm-sans">{timeAgo(chat.updated_at)}</span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}
