'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, Bell, Shield, ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProfileSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/profile')
                if (res.ok) {
                    const data = await res.json()
                    setEmail(data.email || '')
                    setDisplayName(data.display_name || '')
                }
            } catch { /* silent */ }
            finally { setLoading(false) }
        }
        load()
    }, [])

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: displayName })
            })
            if (res.ok) {
                toast.success('Profile updated.')
            } else {
                toast.error('Failed to save changes.')
            }
        } catch {
            toast.error('Something went wrong.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-syne italic leading-none">Control Center</p>
                <h1 className="text-5xl font-black font-syne uppercase italic tracking-tight">Profile <span className="text-blue-500">Settings</span></h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Sidebar Nav */}
                <aside className="lg:col-span-4 space-y-2">
                    <SettingsLink icon={User} label="Profile" active href="/settings/profile" />
                    <SettingsLink icon={CreditCard} label="Billing" href="/settings/billing" />
                    <SettingsLink icon={Shield} label="Security" href="/settings" />
                </aside>

                {/* Content */}
                <main className="lg:col-span-8 space-y-10">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2].map(i => (
                                <div key={i} className="glass-card p-8 h-32 animate-pulse bg-white/[0.02]" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <section className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic px-1">Identity</h3>
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-3xl font-black font-syne italic text-blue-500">
                                            {(displayName?.[0] || email?.[0] || 'S').toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-black font-syne italic uppercase">{displayName || 'Student'}</p>
                                            <p className="text-xs font-bold text-white/20 font-dm-sans italic">{email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/10 font-syne italic">Display Name</label>
                                            <input
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Your name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-dm-sans italic focus:border-blue-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/10 font-syne italic">Email Address</label>
                                            <input
                                                value={email}
                                                disabled
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold font-dm-sans italic opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-6 border-t border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic px-1">Security</h3>
                                <div className="glass-card p-8 space-y-4">
                                    <p className="text-xs font-bold text-white/30 font-dm-sans italic">Password is managed through Supabase Auth. Use the forgot password flow to reset.</p>
                                </div>
                            </section>

                            <motion.button
                                onClick={handleSave}
                                disabled={saving}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Syncing...' : 'Save Changes'}
                            </motion.button>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}

function SettingsLink({ icon: Icon, label, active, href }: any) {
    return (
        <Link
            href={href}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest font-syne italic transition-all ${active
                ? 'glass-card border-blue-500/20 bg-blue-500/5 text-blue-400'
                : 'glass-card border-transparent text-white/40 hover:text-white/60 hover:border-white/5'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    )
}
