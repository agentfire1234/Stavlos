import { UsageStats } from '@/components/dashboard/usage-stats'
import { CourseGrid } from '@/components/dashboard/course-grid'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getDashboardData } from '@/lib/db/dashboard'
import Link from 'next/link'
import {
    Zap,
    Brain,
    Type,
    Quote,
    Plus,
    History,
    Crown,
    Flame,
    ArrowUpRight
} from 'lucide-react'
import { getBadge } from '@/lib/referral'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // REAL DATA FETCHING
    const data = await getDashboardData(user.id, user.email!)
    const userFirstName = user.email?.split('@')[0] || 'Student'
    const badge = getBadge(data.waitlist?.current_rank || 10000)

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tight italic mb-2 uppercase">
                        STAY ELITE, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent capitalize">{userFirstName}</span>.
                    </h1>
                    <p className="text-white/40 font-medium tracking-wide flex items-center gap-2">
                        {badge.title} <span className="w-1 h-1 rounded-full bg-white/20" /> Ready to dominate your courses today?
                    </p>
                </div>

                {/* Viral Stats (Zero Fake Data) */}
                <div className="glass-card px-8 py-6 flex items-center gap-6">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${badge.color}`}>{badge.title}</p>
                        <p className="text-2xl font-black italic">#{data.waitlist?.current_rank || '...'}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Impact</p>
                        <p className="text-2xl font-black text-blue-400 italic">{data.waitlist?.referral_count || 0} REFS</p>
                    </div>
                </div>
            </div>

            {/* Performance Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Daily AI Burn"
                    value={`${data.usage.used}/${data.usage.limit}`}
                    sub={`${data.usage.limit - data.usage.used} messages left`}
                    progress={(data.usage.used / data.usage.limit) * 100}
                    icon={<Zap className="w-4 h-4 text-yellow-500" />}
                />
                <StatCard
                    label="Study Streak"
                    value={`${data.streak} Days`}
                    sub="Keep the fire alive"
                    icon={<Flame className="w-4 h-4 text-orange-500" />}
                />
                <StatCard
                    label="Member Plan"
                    value={data.profile?.is_pro ? 'STAVLOS PRO' : 'FREE TIER'}
                    sub={data.profile?.is_pro ? 'Elite Access Active' : 'Upgrade to dominate'}
                    icon={<Crown className="w-4 h-4 text-purple-500" />}
                    link={!data.profile?.is_pro ? { label: "UPGRADE", href: "/pricing" } : undefined}
                />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Side: Syllabus Control */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <div className="flex items-center justify-between mb-8 ml-1">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 italic">Course Index</h2>
                            </div>
                            <Link href="/syllabus" className="glass-card px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10">
                                <Plus className="w-3 h-3" /> New Syllabus
                            </Link>
                        </div>
                        <CourseGrid syllabuses={data.syllabuses} />
                    </section>

                    {/* Quick Tools Grid - SPEC ALIGNED */}
                    <section>
                        <div className="flex items-center justify-between mb-8 ml-1">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 italic">Quick Utility</h2>
                            </div>
                            <Link href="/tools" className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
                                All Tools →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: <Brain />, title: 'Flashcards', href: '/tools/flashcards' },
                                { icon: <Quote />, title: 'Citations', href: '/tools/citations' },
                                { icon: <Type />, title: 'Grammar', href: '/tools/grammar' },
                                { icon: <Plus />, title: 'Summarize', href: '/tools/summarizer' }
                            ].map(tool => (
                                <Link
                                    key={tool.title}
                                    href={tool.href}
                                    className="p-8 glass-card flex flex-col items-center text-center space-y-4 group"
                                >
                                    <div className="text-white/20 group-hover:text-blue-500 transition-colors duration-500">
                                        {tool.icon}
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{tool.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Side: Activity & History */}
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center justify-between mb-8 ml-1">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 italic">Activity Feed</h2>
                            </div>
                            <Link href="/chat" className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
                                History
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {data.conversations.length > 0 ? (
                                data.conversations.map(convo => (
                                    <Link key={convo.id} href={`/chat?id=${convo.id}`} className="block glass-card p-6 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-xs uppercase tracking-tight group-hover:text-blue-400 transition-colors italic line-clamp-1">{convo.title}</h4>
                                            <History className="w-3 h-3 text-white/10" />
                                        </div>
                                        <p className="text-white/20 text-[10px] font-medium line-clamp-1">{convo.preview || 'No preview available'}</p>
                                    </Link>
                                ))
                            ) : (
                                <div className="glass-card p-12 text-center border-dashed">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">Zero Activity Found</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Pro CTA */}
                    {!data.profile?.is_pro && (
                        <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 space-y-6">
                            <Crown className="w-8 h-8 text-yellow-500 mb-2" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Founding Upgrade</h3>
                            <p className="text-xs text-white/40 leading-relaxed font-medium">Unlock unlimited syllabus indexing and high-frequency AI models.</p>
                            <Link href="/pricing" className="w-full bg-white text-black py-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                Claim Spot <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, sub, progress, icon, link }: any) {
    return (
        <div className="glass-card p-8 group">
            <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{label}</p>
                {icon}
            </div>
            <div className="flex items-end justify-between mb-4">
                <p className="text-4xl font-black italic tracking-tighter uppercase">{value}</p>
                {link && (
                    <Link href={link.href} className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline">
                        {link.label} →
                    </Link>
                )}
            </div>
            {progress !== undefined && (
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            )}
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>
        </div>
    )
}
