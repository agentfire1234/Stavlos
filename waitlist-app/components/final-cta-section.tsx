'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Mail, PhoneCall, ArrowRight } from 'lucide-react'

type FinalCTAProps = {
    studentsJoined: number
    onSignup: (email: string) => void
}

export function FinalCTASection({ studentsJoined, onSignup }: FinalCTAProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        onSignup(email)
    }

    return (
        <section className="py-24 px-6 section-alt border-t border-[var(--border)] relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-t from-[var(--primary-blue)]/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic uppercase">Ready to Never Search a Syllabus Again?</h2>
                    <p className="text-[var(--text-muted)] text-xl mb-12 font-medium">
                        Join {studentsJoined.toLocaleString()} students who are already on the list.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto mb-8">
                        <div className="relative flex-1">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 pl-14 pr-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] transition-all"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Claim Spot
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        <div className="flex items-center gap-2">✨ No credit card required</div>
                        <div className="flex items-center gap-2">🚀 Launch: Early March 2026</div>
                        <div className="flex items-center gap-2">✨ Early access (1 week before)</div>
                    </div>

                    <div className="card-premium p-8 md:p-10 border-[var(--primary-blue)]/30 bg-[var(--primary-blue)]/[0.02]">
                        <h3 className="text-2xl font-bold mb-4">Want a demo?</h3>
                        <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
                            Talk to me (Abraham) directly. I&apos;ll show you how it works and even manually analyze your syllabus for free.
                        </p>
                        <Button variant="outline" size="lg" className="w-full md:w-auto px-12 gap-3">
                            <PhoneCall className="w-5 h-5" />
                            Book a 15-min Call
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
