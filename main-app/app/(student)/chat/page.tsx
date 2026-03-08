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
    Sparkles,
    BookOpen,
    Calculator,
    CheckSquare,
    FileText,
    PenTool,
    Layers,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { FlashcardButton } from '@/components/chat/flashcard-button'

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

        const contextId = searchParams.get('syllabus')
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
        activeMode === 'syllabus' ? "Searching knowledge..." : "Preparing request...",
        activeMode === 'syllabus' ? "Grounding in syllabus..." : "Processing...",
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

            if (data.chatId && !chatId) {
                setChatId(data.chatId)
                loadChatHistory()
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to get response. Try again.")
        } finally {
            clearInterval(interval)
            setIsThinking(false)
        }
    }

    const filteredHistory = searchQuery
        ? chatHistory.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        : chatHistory

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const todayChats = filteredHistory.filter(c => new Date(c.updated_at).toDateString() === today)
    const yesterdayChats = filteredHistory.filter(c => new Date(c.updated_at).toDateString() === yesterday)
    const olderChats = filteredHistory.filter(c => {
        const d = new Date(c.updated_at).toDateString()
        return d !== today && d !== yesterday
    })

    return (
        <div className="flex h-screen bg-[#111318] overflow-hidden -m-6 md:-m-8 -mt-4">
            {/* Left History Panel */}
            <aside className="hidden lg:flex flex-col w-[260px] bg-[#0d1117] border-r border-[#2d3139]">
                <div className="p-4 space-y-4">
                    <button
                        onClick={startNewChat}
                        className="flex items-center gap-2 w-full h-10 px-4 bg-[#1e2128] border border-[#2d3139] hover:bg-[#262b35] text-[#e2e8f0] rounded-lg text-sm font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Chat</span>
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search chats"
                            className="w-full bg-[#1a1f27] border border-[#2d3139] rounded-lg h-9 pl-9 pr-4 text-[13px] text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#3b82f6] transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-4 scrollbar-hide">
                    {todayChats.length > 0 && (
                        <ChatHistoryGroup label="Today" chats={todayChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                    {yesterdayChats.length > 0 && (
                        <ChatHistoryGroup label="Yesterday" chats={yesterdayChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                    {olderChats.length > 0 && (
                        <ChatHistoryGroup label="This Week" chats={olderChats} activeChatId={chatId} onSelect={loadChat} />
                    )}
                </div>
            </aside>

            {/* Main Chat Content */}
            <main className="flex-1 flex flex-col relative bg-[#111318]">
                {/* Top Action Bar */}
                <header className="h-[52px] border-b border-[#2d3139] px-5 flex items-center justify-between bg-[#111318] sticky top-0 z-10">
                    <div className="flex items-center gap-5 min-w-0">
                        <span className="text-sm font-medium text-[#e2e8f0] truncate max-w-[200px]">
                            {chatId ? chatHistory.find(c => c.id === chatId)?.title || 'Chat' : 'New Chat'}
                        </span>

                        <div className="hidden md:flex items-center gap-2">
                            <div className="h-4 w-[1px] bg-[#2d3139] mx-1" />
                            <div className="flex items-center gap-1">
                                {MODES.map(mode => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setActiveMode(mode.id)}
                                        className={`px-3 h-7 rounded-full text-[12px] font-medium transition-all ${activeMode === mode.id
                                            ? 'bg-[#1e2128] border border-[#3b82f6] text-[#3b82f6]'
                                            : 'text-[#64748b] hover:text-[#e2e8f0]'
                                            }`}
                                    >
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {activeMode === 'syllabus' && syllabuses.length > 0 && (
                            <select
                                value={selectedSyllabus}
                                onChange={(e) => setSelectedSyllabus(e.target.value)}
                                className="bg-transparent text-[12px] font-medium text-[#3b82f6] outline-none"
                            >
                                {syllabuses.map(s => (
                                    <option key={s.id} value={s.id}>{s.course_name}</option>
                                ))}
                            </select>
                        )}
                        <span className="text-[12px] text-[#64748b]">Llama 3.3 70B</span>
                    </div>
                </header>

                {/* Messages Container */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto pt-10 pb-40 px-6 scroll-smooth">
                    <div className="max-w-[760px] mx-auto space-y-8">
                        <AnimatePresence mode="popLayout">
                            {messages.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-12 h-12 rounded-xl bg-[#1e2128] border border-[#2d3139] flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-[#2d3139]" />
                                    </div>
                                    <h2 className="text-[22px] font-semibold font-syne text-[#e2e8f0]">What do you want to study?</h2>
                                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                                        {["When is my exam?", "Summarize my notes", "Solve a math problem", "Fix my grammar"].map(chip => (
                                            <button
                                                key={chip}
                                                onClick={() => { setInput(chip); handleSend(); }}
                                                className="px-4 h-9 bg-[#1e2128] border border-[#2d3139] hover:border-[#3b82f6] rounded-full text-[13px] text-[#94a3b8] hover:text-[#e2e8f0] transition-all"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg.id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                                        <div className={`p-4 rounded-2xl text-[14px] leading-[1.7] font-dm-sans ${msg.role === 'user'
                                            ? 'bg-[#1e2128] border border-[#2d3139] text-[#e2e8f0] rounded-tr-[4px]'
                                            : 'text-[#e2e8f0] bg-[#161b22] border border-[#2d3139] rounded-tl-[4px]'
                                            }`}>
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                {msg.content.split(/(\[FLASHCARD_SET:[a-f0-9-]+\])/g).map((part, i) => {
                                                    const match = part.match(/\[FLASHCARD_SET:([a-f0-9-]+)\]/)
                                                    if (match) {
                                                        return <FlashcardButton key={i} setId={match[1]} />
                                                    }
                                                    return <ReactMarkdown key={i}>{part}</ReactMarkdown>
                                                })}
                                            </div>
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
                            placeholder="Ask anything..."
                            rows={1}
                            className="w-full bg-transparent border-none outline-none resize-none px-2 py-1 text-[14px] text-[#e2e8f0] placeholder-[#64748b] min-h-[24px] max-h-40"
                        />
                        <div className="flex items-center justify-between mt-2 px-1">
                            <div className="flex items-center gap-2">
                                <button type="button" className="p-1.5 text-[#64748b] hover:text-[#e2e8f0] transition-colors rounded-md hover:bg-white/5">
                                    <Paperclip className="w-[18px] h-[18px]" />
                                </button>
                                <div className="px-2 py-0.5 bg-[#161b22] text-[#64748b] text-[11px] font-medium rounded">
                                    {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Mode
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
            </main>
        </div>
    )
}

function ChatHistoryGroup({ label, chats, activeChatId, onSelect }: {
    label: string
    chats: ChatItem[]
    activeChatId: string | null
    onSelect: (id: string) => void
}) {
    return (
        <section className="space-y-1">
            <h3 className="px-3 py-2 text-[11px] font-medium text-[#64748b] uppercase tracking-wider">{label}</h3>
            {chats.map(chat => (
                <button
                    key={chat.id}
                    onClick={() => onSelect(chat.id)}
                    className={`nav-item w-full h-9 flex items-center px-3 rounded-md text-[13px] truncate transition-all ${chat.id === activeChatId
                        ? 'bg-[#1e2128] text-[#e2e8f0] border-l-2 border-[#3b82f6] rounded-l-none'
                        : 'text-[#94a3b8] hover:bg-[#1e2128] hover:text-[#e2e8f0]'
                        }`}
                >
                    <span className="truncate">{chat.title || 'Untitled Chat'}</span>
                </button>
            ))}
        </section>
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#111318]" />}>
            <ChatClient />
        </Suspense>
    )
}
