'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Trophy,
    Crown,
    ArrowUp,
    ArrowDown,
    Loader2,
    ShieldCheck,
    Copy,
    Check,
    Zap
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import toast from 'react-hot-toast'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function LeaderboardPage() {
    const [stats, setStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userRank, setUserRank] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 30000)
        return () => clearInterval(interval)
    }, [])

    async function loadData() {
        // Fetch top 50 by referrals
        const { data: { user } } = await supabase.auth.getUser()

        const { data: leaderboard } = await supabase
            .from('waitlist')
            .select('email, referral_count, current_rank')
            .order('referral_count', { ascending: false })
            .limit(50)

        setStats(leaderboard || [])

        if (user) {
            const { data: uRank } = await supabase
                .from('waitlist')
                .select('*')
                .eq('email', user.email)
                .single()
            setUserRank(uRank)
        }
        setLoading(false)
    }

    const copyLink = () => {
        if (!userRank) return
        const link = `https://stavlos.com/waitlist?ref=${userRank.referral_code}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        toast.success("Referral link integrated into clipboard.")
        setTimeout(() => setCopied(false), 2000)
    }

    const formatEmail = (email: string) => {
        const [name, domain] = email.split('@')
        return `${name.slice(0, 3)}***@${domain}`
    }

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-syne italic">Accessing Hall of Fame...</p>
        </div>
    )

    const podium = stats.slice(0, 3)
    const remaining = stats.slice(3)

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto px-6 py-12 space-y-20"
        >
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border-amber-500/20 shadow-2xl shadow-amber-500/10">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 font-syne italic">Live Data Integration</span>
                </div>
                <h1 className="text-6xl font-black font-syne uppercase italic tracking-tighter">Hall of <span className="text-amber-500">Fame</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">The students who believed earliest.</p>
            </header>

            {/* Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12 pb-20 px-4">
                {/* Silver - Rank 2 */}
                <motion.div variants={item} className="order-2 md:order-1 flex flex-col items-center gap-6">
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase font-syne italic">{formatEmail(podium[1]?.email || '***@***.com')}</p>
                        <p className="text-2xl font-black text-slate-300 font-syne italic">{podium[1]?.referral_count || 0} REFS</p>
                    </div>
                    <div className="w-full h-40 glass-card bg-slate-500/5 border-slate-500/20 relative flex flex-col items-center justify-center">
                        <div className="absolute -top-10 w-16 h-16 rounded-3xl glass-card flex items-center justify-center border-slate-400">
                            <Trophy className="w-8 h-8 text-slate-400" />
                        </div>
                        <span className="text-6xl font-black text-slate-400 font-syne italic opacity-10">#2</span>
                    </div>
                </motion.div>

                {/* Gold - Rank 1 */}
                <motion.div variants={item} className="order-1 md:order-2 flex flex-col items-center gap-6">
                    <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <Crown className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                            <p className="text-[10px] font-black text-white/60 uppercase font-syne italic">{formatEmail(podium[0]?.email || '***@***.com')}</p>
                        </div>
                        <p className="text-4xl font-black text-amber-500 font-syne italic tracking-tighter">{podium[0]?.referral_count || 0} REFS</p>
                    </div>
                    <div className="w-full h-64 glass-card bg-amber-500/5 border-amber-500/30 relative flex flex-col items-center justify-center shadow-2xl shadow-amber-500/20">
                        <div className="absolute -top-12 w-20 h-20 rounded-[2.5rem] glass-card border-amber-400 flex items-center justify-center shadow-2xl shadow-amber-400/30">
                            <Trophy className="w-10 h-10 text-amber-400" />
                        </div>
                        <span className="text-8xl font-black text-amber-400 font-syne italic opacity-10">#1</span>
                    </div>
                </motion.div>

                {/* Bronze - Rank 3 */}
                <motion.div variants={item} className="order-3 flex flex-col items-center gap-6">
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase font-syne italic">{formatEmail(podium[2]?.email || '***@***.com')}</p>
                        <p className="text-2xl font-black text-orange-500 font-syne italic">{podium[2]?.referral_count || 0} REFS</p>
                    </div>
                    <div className="w-full h-32 glass-card bg-orange-600/5 border-orange-600/20 relative flex flex-col items-center justify-center">
                        <div className="absolute -top-10 w-16 h-16 rounded-3xl glass-card flex items-center justify-center border-orange-600">
                            <Trophy className="w-8 h-8 text-orange-600" />
                        </div>
                        <span className="text-5xl font-black text-orange-600 font-syne italic opacity-10">#3</span>
                    </div>
                </motion.div>
            </div>

            {/* List View */}
            <motion.section variants={item} className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
                <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-syne italic">
                            <th className="px-8 py-6">Rank</th>
                            <th className="px-8 py-6">Identity</th>
                            <th className="px-8 py-6">Impact</th>
                            <th className="px-8 py-6 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {remaining.map((user, idx) => (
                            <tr key={user.email} className={`group hover:bg-white/[0.02] transition-colors ${userRank?.email === user.email ? 'bg-blue-500/5' : ''}`}>
                                <td className="px-8 py-5 text-sm font-black italic font-syne text-white/40">#{idx + 4}</td>
                                <td className="px-8 py-5 text-xs font-bold font-dm-sans italic text-white/80">{formatEmail(user.email)}</td>
                                <td className="px-8 py-5 text-xs font-black font-syne italic">{user.referral_count} REFS</td>
                                <td className="px-8 py-5 text-right">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">Scholar</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.section>

            {/* Sticky Foot Card for User */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 pointer-events-none"
            >
                <div className="glass-card p-6 border-blue-500/30 bg-black/60 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black uppercase text-blue-400 font-syne leading-none">Rank</span>
                            <span className="text-xl font-black italic font-syne text-white tracking-tighter leading-none mt-1">
                                #{userRank?.current_rank || 'N/A'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest italic font-syne">Elevate Your Rank</p>
                            <p className="text-[10px] font-bold text-white/30 font-dm-sans italic">Refer 1 more friend for <span className="text-amber-500">Founding Status</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex flex-col items-end px-3">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/10 font-syne leading-none mb-1">Your Protocol</p>
                            <p className="text-[10px] font-bold text-blue-500 font-dm-sans italic">stavlos.com/ref?={userRank?.referral_code || '...'}</p>
                        </div>
                        <button
                            onClick={copyLink}
                            className={`btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] font-syne italic ${copied ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Invite'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
