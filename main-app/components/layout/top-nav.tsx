'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export function TopNav() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`h-16 sticky top-0 z-40 px-8 flex items-center justify-between transition-all ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
            }`}>
            <div className="flex items-center gap-4 flex-1">
                <Link href="/dashboard" className="hidden sm:inline-flex items-center">
                    <Logo size={22} className="text-teal-400" href="/dashboard" />
                </Link>
                <div className="relative group max-w-md w-full hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20">
                        🔍
                    </div>
                    <input
                        type="text"
                        placeholder="Search syllabi, notes, or chat... (CMD+K)"
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-white/40 hover:text-white transition relative">
                    🔔
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </button>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-white/10 transition">
                    Feedback?
                </button>
            </div>
        </header>
    )
}
