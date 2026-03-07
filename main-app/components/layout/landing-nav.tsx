'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/logo'

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const pathname = usePathname()
    const isLanding = pathname === '/'

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // IntersectionObserver for active nav link (only on landing page)
    useEffect(() => {
        if (!isLanding) return
        const ids = ['features', 'tools', 'pricing', 'faq']
        const observers: IntersectionObserver[] = []
        ids.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
                { rootMargin: '-40% 0px -50% 0px' }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach(o => o.disconnect())
    }, [isLanding])

    const navLinks = [
        { id: 'features', label: 'Features', href: isLanding ? '#features' : '/#features' },
        { id: 'tools', label: 'Tools', href: isLanding ? '#tools' : '/#tools' },
        { id: 'pricing', label: 'Pricing', href: isLanding ? '#pricing' : '/#pricing' },
        { id: 'faq', label: 'FAQ', href: isLanding ? '#faq' : '/#faq' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.06]' : ''}`}>
            <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Logo size={24} className="text-blue-500" />
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold font-syne tracking-tight">STAVLOS</span>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(s => (
                        <Link key={s.id} href={s.href} className={`text-sm font-medium transition-colors relative ${activeSection === s.id ? 'text-white' : 'text-[#94a3b8] hover:text-white'}`}>
                            {s.label}
                            {activeSection === s.id && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden sm:inline-flex px-4 h-9 items-center text-sm font-medium text-[#94a3b8] hover:text-white transition-colors">Log In</Link>
                    <Link href="/signup" className="px-5 h-9 inline-flex items-center text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all">Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
                </div>
            </div>
        </nav>
    )
}
