'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Wrench,
    User
} from 'lucide-react'

const mobileItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Chat', icon: MessageSquare, href: '/chat' },
    { label: 'Syllabi', icon: BookOpen, href: '/syllabus' },
    { label: 'Tools', icon: Wrench, href: '/tools' },
    { label: 'Profile', icon: User, href: '/settings' },
]

export function MobileNav() {
    const pathname = usePathname()

    if (pathname === '/' || pathname.startsWith('/auth') || pathname === '/login' || pathname === '/signup' || pathname === '/offline' || pathname === '/pricing' || pathname.startsWith('/legal') || pathname === '/terms' || pathname === '/privacy' || pathname.startsWith('/waitlist')) return null

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] pb-safe bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/8">
            <div className="relative flex justify-around items-center px-2 py-3">
                {mobileItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${isActive
                                ? 'text-blue-500'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-semibold font-body uppercase tracking-tighter">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
