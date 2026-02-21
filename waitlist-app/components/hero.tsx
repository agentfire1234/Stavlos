'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Mail, ArrowRight, Sparkles } from 'lucide-react'

type HeroProps = {
    spotsLeft: number
    studentsJoined: number
    onSignup: (email: string) => void
}

export function Hero({ spotsLeft, studentsJoined, onSignup }: HeroProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        onSignup(email)
    }

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-blue)]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--success-green)]/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary-blue)]/20 bg-[var(--primary-blue)]/5 mb-8">
                        <Sparkles className="w-4 h-4 text-[var(--primary-blue)]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-blue)]">
                            {spotsLeft} Founding Seats Left
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-[0.9]">
                        The AI Study Partner That Actually <span className="text-[var(--primary-blue)]">Gets It.</span>
                    </h1>

                    <p className="text-[var(--text-muted)] text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                        Stop searching. Start knowing. Stavlos reads your syllabus so you don&apos;t have to. Join {studentsJoined.toLocaleString()} students locking in €5/month forever.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto mb-10">
                        <div className="relative flex-1">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] transition-all"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="h-16 px-10 text-xl"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Claim Spot
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">✨ LOCK IN €5/MO FOREVER</div>
                        <div className="flex items-center gap-2">🚀 MARCH 2026 LAUNCH</div>
                        <div className="flex items-center gap-2">🛡️ NO CREDIT CARD NEEDED</div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
