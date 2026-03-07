'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Check,
    Zap,
    Crown,
    ArrowRight,
    Lock,
    Users,
    Star,
    Sparkles,
    Shield
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
}

export default function PricingPage() {
    const [data, setData] = useState<any>(null)
    const [seats, setSeats] = useState(0)

    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: waitlist } = await supabase
                    .from('waitlist')
                    .select('*')
                    .eq('email', user.email)
                    .single()
                setData(waitlist)
            }
            const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true })
            setSeats(count || 0)
        }
        load()
    }, [])

    const isLocked = (data?.current_rank || 10000) <= 2000 || (data?.referral_count || 0) >= 1
    const hasFreeMonth = (data?.referral_count || 0) >= 2
    const price = isLocked ? 5 : 8

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto px-6 py-20 space-y-20 flex flex-col items-center"
        >
            <header className="text-center space-y-4">
                <div className="inline-flex gap-2 items-center bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 font-syne italic">Exclusive Founder Access</span>
                </div>
                <h1 className="text-6xl font-black font-syne uppercase italic tracking-tighter">Secure Your <span className="text-blue-500 text-glow-blue">Spot</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic">Personalized pricing based on your waitlist rank and impact.</p>
            </header>

            {/* Dynamic Status Badges */}
            <div className="flex flex-wrap justify-center gap-4">
                {isLocked && (
                    <motion.div variants={item} className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-card border-emerald-500/40 bg-emerald-500/5">
                        <Shield className="w-5 h-5 text-emerald-500 shadow-emerald-500/20" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-emerald-500/60 font-syne leading-none">Price Protocol</span>
                            <span className="text-xs font-black uppercase text-white font-syne italic">Locked at €5 Forever</span>
                        </div>
                    </motion.div>
                )}
                {hasFreeMonth && (
                    <motion.div variants={item} className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-card border-blue-500/40 bg-blue-500/5">
                        <Star className="w-5 h-5 text-blue-500 shadow-blue-500/20" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-blue-500/60 font-syne leading-none">Impact Reward</span>
                            <span className="text-xs font-black uppercase text-white font-syne italic">First Month Free</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Pricing Card */}
            <motion.div
                variants={item}
                className={`relative w-full max-w-lg glass-card p-12 space-y-12 border-2 overflow-hidden transition-all duration-700 ${isLocked ? 'border-blue-500/30 bg-blue-500/[0.02]' : 'border-white/10'
                    }`}
            >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -translate-y-4">
                    <Zap className="w-64 h-64 text-blue-500" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Crown className={`w-4 h-4 ${isLocked ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] font-syne italic">Founding Student</span>
                        </div>
                        <h2 className="text-7xl font-black font-syne italic tracking-tighter">€{price}<span className="text-lg font-bold text-white/20 not-italic ml-2">/mo</span></h2>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic border-b border-white/5 pb-4">Inclusive Systems</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {[
                            'Unlimited RAG Memory',
                            'Llama 3.3 70B Access',
                            'Six specialized modules',
                            'Smart exam triggers',
                            'Priority neural link',
                            'Early feature entry'
                        ].map(feat => (
                            <div key={feat} className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                                <span className="text-xs font-bold font-dm-sans text-white/80 italic">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 relative z-10 pt-4">
                    <button className="btn-primary w-full py-5 text-sm font-black uppercase tracking-[0.3em] font-syne italic group">
                        Enter Neural Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-[10px] font-bold text-white/20 font-dm-sans italic">Payments launch at general release — June 2026</p>
                </div>
            </motion.div>

            {/* Referal CTA if not locked */}
            {!isLocked && (
                <Link href="/leaderboard" className="group">
                    <div className="flex items-center gap-3 px-8 py-4 rounded-2xl glass-card border-amber-500/20 bg-amber-500/5 group-hover:border-amber-500/50 transition-all">
                        <p className="text-xs font-black uppercase tracking-widest text-amber-500 font-syne italic">Want €5 forever? Refer 1 friend →</p>
                    </div>
                </Link>
            )}

            {/* Global Progress */}
            <motion.div variants={item} className="w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest font-syne italic">
                    <span className="text-white/30">Founding Seating</span>
                    <span className="text-blue-500">{seats} / 2000 Claimed</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${(seats / 2000) * 100}%` }} />
                </div>
            </motion.div>
        </motion.div>
    )
}
