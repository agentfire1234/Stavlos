'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
    role: 'user' | 'assistant'
    content: string
    id: string
}

export default function ChatPage() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm Stavlos. I've analyzed your CS101 syllabus. What would you like to study today?", id: 'init' }
    ])
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg: Message = { role: 'user', content: input, id: Date.now().toString() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': 'demo-user' // Placeholder for auth
                },
                body: JSON.stringify({
                    message: input,
                    taskType: 'general_chat'
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Failed to send')

            const assistantMsg: Message = {
                role: 'assistant',
                content: data.response,
                id: (Date.now() + 1).toString()
            }
            setMessages(prev => [...prev, assistantMsg])
        } catch (error) {
            console.error(error)
            alert("Error sending message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar (Collapsed on mobile, similar to dashboard) */}
            <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:block">
                <div className="p-4 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white">
                        ← Back to Dashboard
                    </Link>
                </div>
                <div className="p-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase mb-3">Chats</h3>
                    <div className="space-y-1">
                        <div className="p-2 bg-white/5 rounded-lg text-sm truncate cursor-pointer border border-white/5">
                            CS101 Midterm Prep
                        </div>
                        <div className="p-2 text-white/40 hover:bg-white/5 rounded-lg text-sm truncate cursor-pointer">
                            Essay Outline History
                        </div>
                    </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col relative">
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-2xl p-4 rounded-2xl ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white/10 border border-white/5 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{m.content}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
                                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/80 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about your syllabus..."
                            disabled={loading}
                            className="w-full pl-6 pr-16 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition"
                        >
                            🚀
                        </button>
                    </form>
                    <div className="text-center mt-2 text-xs text-white/30">
                        Stavlos AI can make mistakes. Double check important info.
                    </div>
                </div>
            </main>
        </div>
    )
}

import Link from 'next/link'
