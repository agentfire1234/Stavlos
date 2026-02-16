'use client'

import { useState } from 'react'
import { User, Mail, Bell, Shield, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSettingsPage() {
    const [saving, setSaving] = useState(false)

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-2xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight italic">Settings</h1>
                </header>

                <div className="flex gap-12 flex-col md:flex-row">
                    {/* Sidebar Nav */}
                    <nav className="w-full md:w-48 space-y-2">
                        <SettingsLink icon={User} label="Profile" active href="/settings/profile" />
                        <SettingsLink icon={Shield} label="Billing" href="/settings/billing" />
                        <SettingsLink icon={Bell} label="Preferences" href="/settings/preferences" />
                    </nav>

                    {/* Content */}
                    <div className="flex-1 space-y-10">
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Full Name</label>
                                    <input
                                        placeholder="Abraham Student"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Email Address</label>
                                    <input
                                        disabled
                                        placeholder="abraham@example.com"
                                        className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white/30 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 pt-6 border-t border-white/5">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Security</h2>
                            <button className="text-[10px] font-black uppercase tracking-widest px-6 py-3 border border-white/5 rounded-full hover:bg-white/5 transition-all">
                                Change Password
                            </button>
                        </section>

                        <div className="pt-10">
                            <button
                                onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000) }}
                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? 'Syncing...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SettingsLink({ icon: Icon, label, active, href }: any) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${active ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}
            `}
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    )
}
