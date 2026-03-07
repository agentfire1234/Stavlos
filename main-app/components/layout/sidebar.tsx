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
    Plus,
    Zap
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

    if (pathname === '/' ||
        pathname.startsWith('/auth') ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/offline' ||
        pathname === '/pricing' ||
        pathname.startsWith('/legal') ||
        pathname === '/terms' ||
        pathname === '/privacy' ||
        pathname.startsWith('/waitlist')) return null

    return (
        <aside className="hidden md:flex flex-col w-[240px] bg-[#0d1117] border-r border-[#2d3139] fixed h-screen z-50">
            {/* Logo */}
            <div className="p-5 pb-6">
                <Link href="/dashboard" className="block w-fit">
                    <Logo size={32} className="text-white" />
                </Link>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <Link
                    href="/chat"
                    className="flex items-center gap-2 w-full h-10 px-4 bg-[#1e2128] border border-[#2d3139] hover:bg-[#262b35] text-[#e2e8f0] rounded-lg text-sm font-medium transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Chat</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                        >
                            <item.icon className={`w-[18px] h-[18px] mr-[10px] ${isActive ? 'text-[#3b82f6]' : ''}`} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-5 space-y-4">
                {/* Upgrade Button */}
                {profile && !profile.is_pro && (
                    <Link
                        href="/settings/billing"
                        className="flex items-center justify-center gap-2 w-full h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-medium rounded-lg transition-all"
                    >
                        <span>Upgrade to Pro</span>
                    </Link>
                )}

                {/* User Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-[#1e2128] flex items-center justify-center font-bold text-[10px] text-[#e2e8f0] flex-shrink-0">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                profile?.display_name?.slice(0, 2).toUpperCase() || 'ST'
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[#e2e8f0] truncate">
                                {profile?.display_name || 'Loading...'}
                            </span>
                            <span className="text-[11px] text-[#64748b] font-medium">
                                {profile?.is_pro ? 'PRO' : 'FREE PLAN'}
                            </span>
                        </div>
                    </div>
                    <Link href="/settings" className="text-[#64748b] hover:text-[#e2e8f0] transition-colors">
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </aside>
    )
}
