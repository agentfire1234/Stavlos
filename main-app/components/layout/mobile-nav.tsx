'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Library, Settings, Search } from 'lucide-react'

export function MobileNav() {
    const pathname = usePathname()

    const navItems = [
        { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
        { icon: MessageSquare, label: 'Chat', href: '/chat' },
        { icon: Search, label: 'Explore', href: '/tools' },
        { icon: Library, label: 'Library', href: '/library' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ]

    // Only show on student routes
    if (pathname.startsWith('/auth') || pathname === '/' || pathname === '/offline') return null

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-t border-white/5" />
            <div className="relative flex justify-around items-center px-4 py-3 pb-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-400 scale-110' : 'text-white/30 hover:text-white/60'}`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>

            {/* Safe Area Notch Space for PWA */}
            <div className="h-[env(safe-area-inset-bottom)] bg-black/60 backdrop-blur-xl" />
        </nav>
    )
}
