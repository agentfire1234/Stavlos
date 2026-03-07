'use client'

import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
    MessageSquare,
    Upload,
    Calculator,
    CheckSquare,
    ChevronRight,
    BookOpen,
    ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/dashboard')
                if (!res.ok) throw new Error('Failed to load')
                const dashboardData = await res.json()
                setData(dashboardData)
            } catch (err) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <DashboardSkeleton />
    if (error || !data) return <DashboardError onRetry={() => window.location.reload()} />

    const profile = data.profile
    const firstName = profile?.display_name?.split(' ')[0] || 'Student'
    const today = new Date()
    const hour = today.getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto px-6 py-8 space-y-8"
        >
            {/* Header */}
            <motion.header variants={item}>
                <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Dashboard</h1>
                <p className="text-[15px] text-[#94a3b8] font-medium mt-1">
                    {greeting}, {firstName}.
                </p>
            </motion.header>

            {/* Stats Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    label="Messages Today"
                    value={`${data.usage.used} / ${data.usage.limit}`}
                    progress={(data.usage.used / data.usage.limit) * 100}
                    subtext={`Resets in ${getResetTime(data.usage.reset_at)}`}
                    type="usage"
                />
                <StatsCard
                    label="Study Streak"
                    value={`${data.streak} days`}
                    subtext={data.streak === 0 ? "Start studying to begin your streak" : ""}
                    weeklyActivity={data.weeklyActivity}
                    type="streak"
                />
                <StatsCard
                    label="Questions Answered"
                    value={data.totalQuestions}
                    subtext={`${data.usage.used} today`}
                    type="total"
                />
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickAction icon={MessageSquare} label="New Chat" href="/chat" color="#3b82f6" />
                <QuickAction icon={Upload} label="Upload Syllabus" href="/syllabus" color="#8b5cf6" />
                <QuickAction icon={Calculator} label="Math Solver" href="/tools/math-solver" color="#f59e0b" />
                <QuickAction icon={CheckSquare} label="Grammar Fix" href="/tools/grammar" color="#10b981" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-8">
                {/* Recent Conversations */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold font-syne text-[#e2e8f0]">Recent Conversations</h2>
                        <Link href="/chat" className="text-[13px] font-medium text-[#3b82f6] hover:underline">View all</Link>
                    </div>

                    <div className="space-y-1.5">
                        {data.chats.length > 0 ? (
                            data.chats.slice(0, 5).map((chat: any) => (
                                <Link
                                    key={chat.id}
                                    href={`/chat/${chat.id}`}
                                    className="flex items-center justify-between h-14 px-4 bg-[#1e2128] border border-[#2d3139] rounded-lg hover:bg-[#262b35] transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-1.5 rounded bg-[#111318]">
                                            <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#e2e8f0] truncate">
                                                {chat.title || 'Untitled Chat'}
                                            </p>
                                            <p className="text-[12px] text-[#64748b]">
                                                {chat.mode.charAt(0).toUpperCase() + chat.mode.slice(1)} • {formatDistanceToNow(new Date(chat.updated_at))} ago
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#e2e8f0] transition-colors" />
                                </Link>
                            ))
                        ) : (
                            <div className="bg-[#1e2128] border border-[#2d3139] border-dashed rounded-lg p-10 flex flex-col items-center text-center">
                                <MessageSquare className="w-8 h-8 text-[#2d3139] mb-3" />
                                <p className="text-sm text-[#64748b] mb-4">No conversations yet</p>
                                <Link href="/chat" className="text-sm font-medium text-[#3b82f6] hover:underline">Start chatting</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* My Courses */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold font-syne text-[#e2e8f0]">My Courses</h2>
                        <Link href="/syllabus" className="text-[13px] font-medium text-[#3b82f6] hover:underline">Manage all</Link>
                    </div>

                    <div className="space-y-2">
                        {data.syllabuses.length > 0 ? (
                            data.syllabuses.slice(0, 4).map((s: any) => (
                                <div key={s.id} className="bg-[#1e2128] border border-[#2d3139] rounded-lg p-4 space-y-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#e2e8f0] truncate">{s.course_name}</p>
                                        <p className="text-[12px] text-[#64748b] truncate mt-0.5">{s.file_name}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="bg-[#1a2540] text-[#3b82f6] text-[11px] font-medium px-2 py-0.5 rounded">
                                            {s.total_chunks} chunks
                                        </span>
                                        <Link
                                            href={`/chat?syllabus=${s.id}`}
                                            className="text-[12px] font-medium text-[#3b82f6] px-3 py-1 border border-[#3b82f6]/20 rounded-md hover:bg-[#3b82f6]/5 transition-colors"
                                        >
                                            Ask AI
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#1e2128] border border-[#2d3139] border-dashed rounded-lg p-10 flex flex-col items-center text-center">
                                <BookOpen className="w-8 h-8 text-[#2d3139] mb-3" />
                                <p className="text-sm text-[#64748b] mb-4">No syllabi yet</p>
                                <Link href="/syllabus" className="text-sm font-medium text-[#3b82f6] hover:underline">Upload your first PDF</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function StatsCard({ label, value, progress, subtext, type, weeklyActivity }: any) {
    return (
        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
            <div>
                <p className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold font-syne text-[#e2e8f0] mt-1">{value}</p>
            </div>

            <div className="mt-4">
                {type === 'usage' && (
                    <div className="space-y-2">
                        <div className="h-[6px] w-full bg-[#2d3139] rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${progress >= 80 ? 'bg-[#ef4444]' : progress >= 50 ? 'bg-[#f59e0b]' : 'bg-[#10b981]'
                                    }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                        <p className="text-[12px] text-[#64748b]">{subtext}</p>
                    </div>
                )}

                {type === 'streak' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                const date = new Date()
                                date.setDate(date.getDate() - (6 - i))
                                const dateStr = date.toISOString().split('T')[0]
                                const active = weeklyActivity?.includes(dateStr)
                                const isToday = i === 6
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <div
                                            className={`w-[10px] h-[10px] rounded-full transition-all ${active ? 'bg-[#3b82f6]' : 'bg-[#2d3139]'
                                                } ${isToday ? 'ring-1 ring-[#3b82f6] ring-offset-2 ring-offset-[#1e2128]' : ''}`}
                                        />
                                        <span className="text-[10px] text-[#64748b]">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        {subtext && <p className="text-[12px] text-[#64748b]">{subtext}</p>}
                    </div>
                )}

                {type === 'total' && (
                    <p className="text-[12px] text-[#64748b]">{subtext}</p>
                )}
            </div>
        </div>
    )
}

function QuickAction({ icon: Icon, label, href, color }: any) {
    return (
        <Link href={href} className="flex-1">
            <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-4 flex flex-col items-start min-h-[100px] hover:bg-[#262b35] hover:border-[#3d4351] transition-all group">
                <Icon className="w-6 h-6" style={{ color }} />
                <span className="text-sm font-medium text-[#e2e8f0] mt-auto">{label}</span>
            </div>
        </Link>
    )
}

function DashboardSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-40 bg-[#1e2128] rounded" />
                <div className="h-4 w-32 bg-[#1e2128] rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-36 bg-[#1e2128] border border-[#2d3139] rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-[#1e2128] border border-[#2d3139] rounded-xl" />
                ))}
            </div>
        </div>
    )
}

function DashboardError({ onRetry }: any) {
    return (
        <div className="max-w-md mx-auto px-6 py-20 text-center">
            <h3 className="text-xl font-bold font-syne text-[#e2e8f0] mb-2">Something went wrong</h3>
            <p className="text-[#94a3b8] mb-8">We couldn't load your dashboard. Please check your connection and try again.</p>
            <button onClick={onRetry} className="btn-primary w-full">Try Again</button>
        </div>
    )
}

// Helper since I can't import it easily here without verifying path
function getResetTime(resetAt: string) {
    if (!resetAt) return "24h"
    const now = new Date()
    const reset = new Date(resetAt)
    const diff = reset.getTime() - now.getTime()
    if (diff <= 0) return "soon"
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
}
