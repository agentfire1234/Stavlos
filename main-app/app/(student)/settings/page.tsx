'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    CreditCard,
    Share2,
    Shield,
    LogOut,
    Check,
    Copy,
    ChevronRight,
    Crown,
    Save,
    Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type Tab = 'profile' | 'billing' | 'referrals' | 'security'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [waitlist, setWaitlist] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [displayName, setDisplayName] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                // Load profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setProfile(profileData)
                setDisplayName(profileData?.display_name || user.email?.split('@')[0] || '')

                // Load waitlist (for referrals/rank)
                const { data: waitlistData } = await supabase
                    .from('waitlist')
                    .select('*')
                    .eq('email', user.email)
                    .single()
                setWaitlist(waitlistData)
            }
        }
        load()
    }, [])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || isSaving) return

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            toast.success("Profile updated successfully.")
            // Update local state
            setProfile({ ...profile, display_name: displayName })
        } catch (err) {
            console.error(err)
            toast.error("Failed to update profile.")
        } finally {
            setIsSaving(false)
        }
    }

    const copyLink = () => {
        if (!waitlist) return
        const link = `https://stavlos.com/waitlist?ref=${waitlist.referral_code}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        toast.success("Referral link copied.")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const sidebarItems = [
        { id: 'profile' as Tab, label: 'Profile', icon: User },
        { id: 'billing' as Tab, label: 'Billing', icon: CreditCard },
        { id: 'referrals' as Tab, label: 'Referrals', icon: Share2 },
        { id: 'security' as Tab, label: 'Security', icon: Shield },
    ]

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
                    {sidebarItems.map((item) => {
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${isActive
                                        ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                                        : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-[13px] font-semibold">{item.label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-0' : '-rotate-90 opacity-0 group-hover:opacity-100 group-hover:rotate-0'}`} />
                            </button>
                        )
                    })}

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
                <main className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.section
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Profile Info</h2>
                                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-[#111318] border border-[#2d3139] flex items-center justify-center text-3xl font-bold text-[#3b82f6]">
                                                {displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-lg font-bold text-[#e2e8f0] font-syne">
                                                        {displayName || 'Student'}
                                                    </p>
                                                    {profile?.is_pro && (
                                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-tight">Pro Member</span>
                                                    )}
                                                    {waitlist?.current_rank <= 2000 && (
                                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-[#3b82f6] uppercase tracking-tight">Founding Member</span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-[#64748b] font-medium">{user?.email || 'email@example.com'}</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider px-1">Display Name</label>
                                                    <input
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
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

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSaving || displayName === profile?.display_name}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:hover:bg-[#3b82f6] text-white text-[13px] font-bold rounded-lg transition-all"
                                                >
                                                    {isSaving ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'billing' && (
                            <motion.section
                                key="billing"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Subscription & Billing</h2>
                                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-4 -translate-y-4">
                                            <Crown className="w-40 h-40 text-amber-500" />
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                            <div className="space-y-1.5 text-center md:text-left">
                                                <p className="text-base font-bold text-amber-500">
                                                    {profile?.is_pro ? 'Pro Plan' : 'Free Plan'}
                                                </p>
                                                <p className="text-[13px] text-[#64748b] font-medium">
                                                    {waitlist?.current_rank <= 2000 ? 'Founding Member Pricing Active' : 'Standard Student Pricing'}
                                                </p>
                                            </div>
                                            <button className="px-6 py-2.5 bg-[#111318] border border-[#2d3139] hover:border-[#3b82f6]/50 rounded-lg text-[13px] font-semibold text-[#e2e8f0] transition-colors">
                                                Manage Billing
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-[#64748b] italic px-1">Note: Payments are currently paused for public checkout. Pro features are granted to founding members.</p>
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'referrals' && (
                            <motion.section
                                key="referrals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Referrals & Rank</h2>
                                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="text-center bg-[#111318] border border-[#2d3139] rounded-2xl p-4 min-w-[100px]">
                                                    <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Your Rank</p>
                                                    <p className="text-2xl font-bold text-[#e2e8f0] mt-1">#{waitlist?.current_rank || '—'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-[#e2e8f0]">Total Referrals</p>
                                                    <p className="text-[13px] text-[#3b82f6] font-medium">
                                                        {waitlist?.referral_count || 0} students invited
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={copyLink}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[13px] font-semibold text-[#e2e8f0] whitespace-nowrap"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                {copied ? 'Copied' : 'Copy Referral Link'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'security' && (
                            <motion.section
                                key="security"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne px-1">Security & Privacy</h2>
                                    <div className="bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-6">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="space-y-1">
                                                <p className="text-[14px] font-semibold text-[#e2e8f0]">Email Authentication</p>
                                                <p className="text-[12px] text-[#64748b]">Your account uses secure link authentication.</p>
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Active</span>
                                            </div>
                                        </div>
                                        <div className="h-px bg-[#2d3139]" />
                                        <div className="flex items-center justify-between py-2">
                                            <div className="space-y-1">
                                                <p className="text-[14px] font-semibold text-[#e2e8f0]">Data Privacy</p>
                                                <p className="text-[12px] text-[#64748b]">Request a copy of your personal data or delete account.</p>
                                            </div>
                                            <button className="text-[12px] font-medium text-red-500/60 hover:text-red-500 transition-colors">
                                                Manage Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
