'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Wrench,
    Layers
} from 'lucide-react'

const mobileItems = [
    { label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Chat', icon: MessageSquare, href: '/chat' },
    { label: 'Flashcards', icon: Layers, href: '/flashcards' },
    { label: 'Syllabi', icon: BookOpen, href: '/syllabus' },
    { label: 'Tools', icon: Wrench, href: '/tools' },
]

export function MobileNav() {
    const pathname = usePathname()

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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] pb-safe bg-[#111318]/80 backdrop-blur-xl border-t border-[#2d3139]">
            <div className="relative flex justify-around items-center h-[60px]">
                {mobileItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 transition-all h-full flex-1 ${isActive
                                ? 'text-[#3b82f6]'
                                : 'text-[#64748b] hover:text-[#94a3b8]'
                                }`}
                        >
                            <item.icon className="w-[22px] h-[22px]" />
                            <span className="text-[10px] font-medium font-body">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
