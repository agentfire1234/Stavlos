'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItemProps {
    href: string
    icon: string
    label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
    const pathname = usePathname()
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${active
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg shadow-blue-600/5'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
        >
            <span className={`text-xl transition-transform group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-50'}`}>
                {icon}
            </span>
            {label}
        </Link>
    )
}

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0 overflow-hidden">
            <div className="p-8">
                <Link href="/dashboard" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    STAVLOS
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <NavItem href="/dashboard" icon="📊" label="Overview" />
                <NavItem href="/chat" icon="💬" label="AI Partner" />
                <NavItem href="/syllabus" icon="📚" label="Syllabi" />
                <NavItem href="/flashcards" icon="✨" label="Flashcards" />
                <NavItem href="/essays" icon="✍️" label="Essay Help" />
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="glass rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 blur-2xl rounded-full" />
                    <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-2">Free Account</p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-blue-500 w-[45%]" />
                    </div>
                    <p className="text-[11px] text-white/40 mb-3">Daily usage: 9 / 20</p>
                    <button className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-100 transition-all active:scale-95">
                        Upgrade to Pro
                    </button>
                </div>

                <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-white/20" />
                        <span className="text-xs font-bold text-white/50">Student</span>
                    </div>
                    <Link href="/settings" className="text-white/20 hover:text-white transition">
                        ⚙️
                    </Link>
                </div>
            </div>
        </aside>
    )
}
