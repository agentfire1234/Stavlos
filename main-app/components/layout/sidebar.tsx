'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Wrench,
    Settings,
    Zap,
    User
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Chat', icon: MessageSquare, href: '/chat' },
    { label: 'My Syllabi', icon: BookOpen, href: '/syllabus' },
    { label: 'Tools', icon: Wrench, href: '/tools' },
]

export function Sidebar() {
    const pathname = usePathname()
    const [profile, setProfile] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
        }
        getProfile()
    }, [])

    if (pathname === '/' || pathname.startsWith('/auth') || pathname === '/login' || pathname === '/signup' || pathname === '/offline' || pathname === '/pricing' || pathname.startsWith('/legal') || pathname === '/terms' || pathname === '/privacy' || pathname.startsWith('/waitlist')) return null

    return (
        <aside className="hidden md:flex flex-col w-60 bg-[#0a0a0f] border-r border-white/8 fixed h-screen z-50">
            {/* Logo */}
            <div className="p-8">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <Logo size={32} className="text-white group-hover:text-blue-500 transition-colors" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                                ? 'bg-white/5 text-white border border-white/8 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-500' : 'group-hover:text-blue-400'}`} />
                            <span className="font-body">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/8 space-y-4">
                {/* Upgrade Button */}
                {profile && !profile.is_pro && (
                    <Link
                        href="/settings/billing"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        <span className="text-sm">Upgrade to Pro</span>
                    </Link>
                )}

                {/* User Info */}
                <div className="flex items-center justify-between px-2">
                    <Link href="/settings/profile" className="flex items-center gap-3 group overflow-hidden">
                        <div className="w-10 h-10 rounded-full glass-card border-white/10 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 group-hover:border-blue-500/50 transition-all">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                profile?.display_name?.slice(0, 2) || <User className="w-5 h-5 text-slate-500" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-white truncate font-body">
                                {profile?.display_name || 'Loading...'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${profile?.is_pro ? 'text-blue-400' : 'text-slate-500'}`}>
                                {profile?.is_pro ? 'Pro Plan' : 'Free Plan'}
                            </span>
                        </div>
                    </Link>
                    <Link href="/settings" className="text-slate-500 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </aside>
    )
}
