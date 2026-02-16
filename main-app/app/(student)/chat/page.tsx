'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
    role: 'user' | 'assistant'
    content: string
    id: string
    taskType?: string
    steps?: string[]
    sources?: any[]
}

const TASK_MODES = [
    { id: 'general_chat', label: 'Tutor Chat', icon: '🗣️' },
    { id: 'syllabus_qa', label: 'Syllabus Q&A', icon: '📚' },
    { id: 'grammar_fix', label: 'Grammar Fix', icon: '📝' },
    { id: 'flashcard', label: 'Cards', icon: '✨' },
    { id: 'summary', label: 'Summary', icon: '📋' },
    { id: 'essay_outline', label: 'PEEL Outline', icon: '✍️' },
    { id: 'math_solver', label: 'Math', icon: '🧮' },
]

export default function ChatPage() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hey! Abraham here. I've got the filters ready. Just paste your text or ask a question and I'll use Llama 3.1 to help you out! 🚀",
            id: 'init'
        }
    ])
    const [loading, setLoading] = useState(false)
    const [activeTask, setActiveTask] = useState('general_chat')
    const [currentSteps, setCurrentSteps] = useState<string[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading, currentSteps])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg: Message = {
            role: 'user',
            content: input,
            id: Date.now().toString(),
            taskType: activeTask
        }

        setMessages(prev => [...prev, userMsg])
        const currentInput = input
        setInput('')
        setLoading(true)
        setCurrentSteps([])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    taskType: activeTask
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Failed to send')

            // Display steps sequentially for effect
            if (data.steps) {
                for (const step of data.steps) {
                    setCurrentSteps(prev => [...prev, step])
                    await new Promise(r => setTimeout(r, 400))
                }
            }

            const assistantMsg: Message = {
                role: 'assistant',
                content: data.response,
                id: (Date.now() + 1).toString(),
                steps: data.steps,
                sources: data.sources
            }
            setMessages(prev => [...prev, assistantMsg])
            setCurrentSteps([])
        } catch (error: any) {
            console.error(error)
            const errorMsg: Message = {
                role: 'assistant',
                content: error.message || "Ouch. Something went wrong. Make sure you're logged in and try again!",
                id: (Date.now() + 2).toString()
            }
            setMessages(prev => [...prev, errorMsg])
            setCurrentSteps([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mode Selector */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {TASK_MODES.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setActiveTask(mode.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${activeTask === mode.id
                            ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20 text-white'
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <span>{mode.icon}</span>
                        {mode.label}
                    </button>
                ))}
            </div>

            {/* Chat Container */}
            <div className="flex-1 glass rounded-[2rem] overflow-hidden flex flex-col mt-2 relative">
                <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none -z-10" />

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] md:max-w-[75%] space-y-3`}>
                                {m.role === 'user' && (
                                    <div className="flex justify-end pr-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">You</span>
                                    </div>
                                )}
                                <div
                                    className={`p-6 rounded-3xl ${m.role === 'user'
                                        ? 'bg-blue-600 shadow-2xl shadow-blue-600/20 rounded-tr-none'
                                        : 'bg-white/5 border border-white/10 rounded-tl-none'
                                        }`}
                                >
                                    <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                                        {m.content}
                                    </div>

                                    {/* Sources Display */}
                                    {m.sources && m.sources.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Course Context Matches</p>
                                            <div className="flex flex-wrap gap-2">
                                                {m.sources.map((s, idx) => (
                                                    <div key={idx} className="px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-medium text-white/40 italic flex items-center gap-2">
                                                        <span>📌</span> Section {idx + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {m.role === 'assistant' && (
                                    <div className="flex justify-start pl-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">Stavlos AI • {m.steps ? 'Mastered' : 'Intro'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Thinking UI */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="space-y-4 max-w-[70%]">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none flex flex-col gap-4">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Thinking...</span>
                                    </div>

                                    {currentSteps.length > 0 && (
                                        <div className="space-y-2 border-t border-white/5 pt-4">
                                            {currentSteps.map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Container */}
                <div className="p-6 md:p-10 bg-black/50 border-t border-white/5 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Message Stavlos AI (${TASK_MODES.find(m => m.id === activeTask)?.label})...`}
                            disabled={loading}
                            className="relative w-full pl-8 pr-24 py-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-white/20 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 text-white border border-blue-400/20 rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-blue-500 transition-all disabled:opacity-20 active:scale-95 flex items-center gap-2"
                        >
                            Ask <span>🚀</span>
                        </button>
                    </form>
                    <div className="flex justify-center gap-8 mt-6 text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
                        <span>Secure SSL</span>
                        <span>Llama 3.1 70B</span>
                        <span>Encrypted Session</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
