'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    CreditCard,
    Share2,
    Shield,
    LogOut,
    Check,
    Copy,
    ChevronRight,
    Crown
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [data, setData] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const supabase = createClient()

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
        toast.success("Referral link copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            <header>
                <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Settings</h1>
                <p className="text-[15px] text-[#94a3b8] font-medium mt-1">
                    Manage your account and preferences.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-12 items-start">
                {/* Navigation Sidebar */}
                <aside className="space-y-1">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] group transition-all">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4" />
                            <span className="text-[13px] font-semibold">Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5 group transition-all">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[13px] font-semibold font-medium">Billing</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5 group transition-all">
                        <div className="flex items-center gap-3">
                            <Share2 className="w-4 h-4" />
                            <span className="text-[13px] font-semibold font-medium">Referrals</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5 group transition-all">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4" />
                            <span className="text-[13px] font-semibold font-medium">Security</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="pt-8">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-[13px] font-semibold">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="space-y-12">
                    {/* Profile Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Profile Info</h2>
                        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-[#111318] border border-[#2d3139] flex items-center justify-center text-3xl font-bold text-[#3b82f6]">
                                    {user?.email?.[0].toUpperCase() || 'S'}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-bold text-[#e2e8f0] font-syne">
                                            {user?.email?.split('@')[0] || 'Student'}
                                        </p>
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-tight">Founding Member</span>
                                    </div>
                                    <p className="text-[13px] text-[#64748b] font-medium">{user?.email || 'email@example.com'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider px-1">Full Name</label>
                                    <input
                                        defaultValue={user?.email?.split('@')[0]}
                                        className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#3b82f6] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider px-1">Email Address</label>
                                    <input
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full bg-[#111318] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Referrals Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Referrals & Rank</h2>
                        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="text-center bg-[#111318] border border-[#2d3139] rounded-2xl p-4 min-w-[100px]">
                                        <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Your Rank</p>
                                        <p className="text-2xl font-bold text-[#e2e8f0] mt-1">#{data?.current_rank || '—'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-[#e2e8f0]">Total Referrals</p>
                                        <p className="text-[13px] text-[#3b82f6] font-medium">
                                            {data?.referral_count || 0} students invited
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={copyLink}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[13px] font-semibold text-[#e2e8f0] whitespace-nowrap"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied' : 'Copy Referral Link'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Subscription Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">My Plan</h2>
                        <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-4 -translate-y-4">
                                <Crown className="w-40 h-40 text-amber-500" />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-1.5 text-center md:text-left">
                                    <p className="text-base font-bold text-amber-500 group-hover:text-amber-400 transition-colors">Founding Member Plan</p>
                                    <p className="text-[13px] text-[#64748b] font-medium">€5 / month · Price locked forever</p>
                                </div>
                                <button className="px-6 py-2.5 bg-[#111318] border border-[#2d3139] hover:border-[#3b82f6]/50 rounded-lg text-[13px] font-semibold text-[#e2e8f0] transition-colors">
                                    Manage Billing
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
