'use client'

import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
    Zap,
    Flame,
    MessageSquare,
    Upload,
    Calculator,
    CheckSquare,
    ChevronRight,
    ArrowUpRight,
    BookOpen,
    Wrench,
    GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
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
            className="max-w-6xl mx-auto px-6 py-12 space-y-12 pb-24 md:pb-12"
        >
            {/* Header */}
            <motion.header variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-400 font-body">
                        {greeting}, {firstName}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black font-syne tracking-tight text-white uppercase italic">
                        {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)}
                    </h1>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${profile?.is_pro
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                    {profile?.is_pro ? 'Pro Plan' : 'Free Plan'}
                </div>
            </motion.header>

            {/* Stats Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Usage Card */}
                <StatsCard
                    title="Today's Usage"
                    value={data.usage.used}
                    limit={data.usage.limit}
                    subtext={data.usage.used >= data.usage.limit ? "Limit reached" : `Resets in ${getResetTime(data.usage.reset_at)}`}
                    type="usage"
                />

                {/* Streak Card */}
                <StatsCard
                    title="Study Streak"
                    value={data.streak}
                    subtext={data.streak > 2 ? "🔥 You're on fire!" : "Start your streak today"}
                    type="streak"
                    weeklyActivity={data.weeklyActivity}
                />

                {/* Total Questions Card */}
                <StatsCard
                    title="Total Questions"
                    value={data.totalQuestions}
                    subtext={`${data.usage.used} questions today`}
                    type="total"
                />
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickAction icon={MessageSquare} label="New Chat" href="/chat" color="blue" />
                <QuickAction icon={Upload} label="Upload Syllabus" href="/syllabus" color="purple" />
                <QuickAction icon={Calculator} label="Math Solver" href="/tools/math-solver" color="amber" />
                <QuickAction icon={CheckSquare} label="Grammar Fix" href="/tools/grammar" color="emerald" />
            </section>

            {/* Recent & Courses Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Conversations */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold font-syne uppercase italic text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            Recent Conversations
                        </h3>
                        <Link href="/chat" className="text-xs font-bold text-blue-500 hover:text-blue-400 font-body">View all →</Link>
                    </div>

                    <div className="space-y-3">
                        {data.chats.length > 0 ? (
                            data.chats.map((chat: any) => (
                                <Link
                                    key={chat.id}
                                    href={`/chat/${chat.id}`}
                                    className="glass-card p-4 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`p-2 rounded-lg bg-white/5 border border-white/8 group-hover:border-blue-500/50 transition-colors`}>
                                            <MessageSquare className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate font-body">
                                                {chat.title || 'Untitled Chat'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                                {chat.mode} • {formatDistanceToNow(new Date(chat.updated_at))} ago
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                                </Link>
                            ))
                        ) : (
                            <div className="glass-card p-8 text-center border-dashed border-white/10">
                                <p className="text-sm text-slate-500 font-body mb-4">No conversations yet.</p>
                                <Link href="/chat" className="btn-ghost py-2 px-4 text-xs inline-block">Start your first chat →</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* My Courses */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold font-syne uppercase italic text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            My Courses
                        </h3>
                        <Link href="/syllabus" className="text-xs font-bold text-purple-500 hover:text-purple-400 font-body">Manage syllabi →</Link>
                    </div>

                    <div className="space-y-3">
                        {data.syllabuses.length > 0 ? (
                            data.syllabuses.slice(0, 3).map((s: any) => (
                                <div key={s.id} className="glass-card p-4 flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-white truncate font-body">{s.course_name}</p>
                                        <p className="text-[10px] text-slate-500 truncate font-body uppercase tracking-wider">{s.file_name} • {s.total_chunks} chunks</p>
                                    </div>
                                    <Link
                                        href={`/chat?syllabus=${s.id}`}
                                        className="btn-primary py-2 px-4 text-xs whitespace-nowrap"
                                    >
                                        Ask AI
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-8 text-center border-dashed border-white/10">
                                <p className="text-sm text-slate-500 font-body mb-4">No syllabi uploaded.</p>
                                <Link href="/syllabus" className="btn-ghost py-2 px-4 text-xs inline-block">Upload a PDF →</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function StatsCard({ title, value, limit, subtext, type, weeklyActivity }: any) {
    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] mb-4 font-body">{title}</h4>

            {type === 'usage' && (
                <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black font-syne italic">{value}</span>
                        <span className="text-sm font-bold text-slate-600">/ {limit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${(value / limit) > 0.8 ? 'bg-red-500' : (value / limit) > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                            style={{ width: `${Math.min((value / limit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {type === 'streak' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-black font-syne italic">{value}</span>
                        {value > 2 && <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map(i => {
                            const date = new Date()
                            date.setDate(date.getDate() - (6 - i))
                            const dateStr = date.toISOString().split('T')[0]
                            const active = weeklyActivity?.includes(dateStr)
                            return (
                                <div
                                    key={i}
                                    className={`h-2.5 flex-1 rounded-full ${active ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`}
                                    title={new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}
                                />
                            )
                        })}
                    </div>
                </div>
            )}

            {type === 'total' && (
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black font-syne italic">{value}</span>
                </div>
            )}

            <p className="text-[11px] font-semibold text-slate-500 font-body mt-4">{subtext}</p>
        </div>
    )
}

function QuickAction({ icon: Icon, label, href, color }: any) {
    const accentColors: any = {
        blue: 'text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
        purple: 'text-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]',
        amber: 'text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
        emerald: 'text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    }

    return (
        <Link href={href} className="flex-1">
            <div className="glass-card p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 group cursor-pointer text-center h-full">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/8 group-hover:border-white/20 transition-all ${accentColors[color]}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.1em] font-syne italic text-slate-400 group-hover:text-white transition-colors">{label}</span>
            </div>
        </Link>
    )
}

function DashboardSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <div className="h-4 w-32 bg-white/5 rounded" />
                    <div className="h-10 w-64 bg-white/5 rounded" />
                </div>
                <div className="h-6 w-24 bg-white/5 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 glass-card" />
                ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 glass-card" />
                ))}
            </div>
        </div>
    )
}

function DashboardError({ onRetry }: any) {
    return (
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
            <div className="text-6xl mb-6">😕</div>
            <h3 className="text-xl font-bold font-syne uppercase italic text-white mb-2">Neural Link Severed</h3>
            <p className="text-slate-400 font-body mb-8">We couldn't load your dashboard. Your neural connection might be unstable.</p>
            <button onClick={onRetry} className="btn-primary w-full">Reconnect Interface</button>
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
