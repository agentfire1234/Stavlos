'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
    { href: '#how', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: 'mailto:hello@stavlos.com', label: 'Contact' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Main Nav Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-main)]/80 border-b border-[var(--border)]">
                <div className="px-4 sm:px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Logo size={28} />
                        <span className="text-xl font-black tracking-tighter uppercase italic">Stavlos</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="hover:text-[var(--primary-blue)] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme toggle — scaled down 25% on mobile */}
                        <div className="scale-75 sm:scale-100 origin-right">
                            <ThemeToggle />
                        </div>

                        <Link href="/leaderboard" className="hidden sm:block">
                            <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-[var(--primary-blue)] text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-[var(--primary-blue)]/20">
                                Check Rank
                            </button>
                        </Link>



                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-section)] transition-colors border border-[var(--border)]"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Slide-in panel */}
                        <motion.aside
                            key="drawer"
                            className="fixed top-0 right-0 z-[70] h-full w-72 bg-[var(--bg-main)] border-l border-[var(--border)] flex flex-col"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                                <div className="flex items-center gap-2">
                                    <Logo size={24} />
                                    <span className="text-lg font-black tracking-tighter uppercase italic">Stavlos</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[var(--bg-section)] transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-section)] hover:text-[var(--primary-blue)] transition-colors"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </nav>

                            {/* Drawer Footer CTAs */}
                            <div className="px-6 py-6 border-t border-[var(--border)] flex flex-col gap-3">
                                <Link href="/leaderboard" onClick={() => setIsOpen(false)}>
                                    <button className="w-full text-[11px] font-black uppercase tracking-widest py-3 bg-[var(--primary-blue)] text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-[var(--primary-blue)]/20 flex items-center justify-center gap-2">
                                        Check Rank <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>

                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
