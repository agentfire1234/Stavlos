'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    CreditCard,
    Share2,
    Shield,
    Bell,
    LogOut,
    Check,
    Copy,
    ChevronRight,
    Zap,
    Crown
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import toast from 'react-hot-toast'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [data, setData] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data: waitlist } = await supabase
                    .from('waitlist')
                    .select('*')
                    .eq('email', user.email)
                    .single()
                setData(waitlist)
            }
        }
        load()
    }, [])

    const copyLink = () => {
        if (!data) return
        const link = `https://stavlos.com/waitlist?ref=${data.referral_code}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        toast.success("Referral protocol copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            <header className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-syne italic leading-none">Control Center</p>
                <h1 className="text-5xl font-black font-syne uppercase italic tracking-tight">System <span className="text-blue-500">Settings</span></h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Navigation */}
                <aside className="lg:col-span-4 space-y-2">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl glass-card border-blue-500/20 bg-blue-500/5 text-blue-400">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest font-syne italic">Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl glass-card border-transparent hover:border-white/5 text-white/40 hover:text-white transition-all">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest font-syne italic">Billing</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl glass-card border-transparent hover:border-white/5 text-white/40 hover:text-white transition-all">
                        <div className="flex items-center gap-3">
                            <Share2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest font-syne italic">Referrals</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl glass-card border-transparent hover:border-white/5 text-white/40 hover:text-white transition-all">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest font-syne italic">Security</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl glass-card border-transparent hover:border-white/5 text-red-500/40 hover:text-red-500 transition-all mt-8">
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest font-syne italic">Terminate Session</span>
                        </div>
                    </button>
                </aside>

                {/* Content */}
                <main className="lg:col-span-8 space-y-12">

                    {/* Identity Section */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic px-1">Identity</h3>
                        <div className="glass-card p-8 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-3xl font-black font-syne italic text-blue-500">
                                    {user?.email?.[0].toUpperCase() || 'A'}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-black font-syne italic uppercase">{user?.email?.split('@')[0] || 'Student'}</p>
                                        <div className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[8px] font-black text-amber-500 uppercase font-syne">Founding Member</div>
                                    </div>
                                    <p className="text-xs font-bold text-white/20 font-dm-sans italic">{user?.email || 'email@example.com'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/10 font-syne italic">Full Name</label>
                                    <input
                                        defaultValue={user?.email?.split('@')[0]}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-dm-sans italic focus:border-blue-500/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/10 font-syne italic">Academic ID</label>
                                    <input
                                        defaultValue={user?.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-dm-sans italic opacity-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Referrals & Rank */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic px-1">Social Protocol</h3>
                        <div className="glass-card p-8 space-y-8 bg-blue-600/[0.02] border-blue-500/20">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6 text-center md:text-left">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex flex-col items-center justify-center">
                                        <span className="text-[9px] font-black uppercase text-blue-400 font-syne leading-none">Rank</span>
                                        <span className="text-2xl font-black italic text-white font-syne tracking-tighter mt-1">#{data?.current_rank || 'N/A'}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black font-syne uppercase italic">Influence Node</p>
                                        <p className="text-[10px] font-bold text-blue-500/60 font-dm-sans italic uppercase">{data?.referral_count || 0} Successful Links</p>
                                    </div>
                                </div>
                                <button
                                    onClick={copyLink}
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest font-syne italic group transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Integrated' : 'Copy Referral Link'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Subscription Preview */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic px-1">Neural License</h3>
                        <div className="glass-card p-8 border-amber-500/20 bg-amber-500/[0.02] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-4 -translate-y-4">
                                <Crown className="w-40 h-40 text-amber-500" />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-1 text-center md:text-left">
                                    <p className="text-sm font-black font-syne uppercase italic text-amber-500 group-hover:text-amber-400 transition-colors">Founding Scholar Plan</p>
                                    <p className="text-[10px] font-bold text-white/20 font-dm-sans italic">Locked at €5/mo Forever</p>
                                </div>
                                <button className="btn-secondary px-8 py-3 text-[9px] font-black uppercase tracking-widest font-syne italic border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                                    Manage Subscription
                                </button>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    )
}
