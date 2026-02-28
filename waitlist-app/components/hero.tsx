'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

type HeroProps = {
    spotsLeft: number
    studentsJoined: number
    onSignup: (email: string) => Promise<void> | void
}

export function Hero({ spotsLeft, studentsJoined, onSignup }: HeroProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        try {
            await onSignup(email)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[var(--primary-blue)]/10 rounded-full blur-[120px] animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-[var(--success-green)]/5 rounded-full blur-[120px] animate-pulse"
                    style={{ animationDelay: '700ms' }}
                />
            </div>

            <div className="max-w-7xl mx-auto w-full">
                {/* Flex layout: stacked on mobile, side-by-side on lg+ */}
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                    {/* Left: Text Content */}
                    <motion.div
                        className="flex-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary-blue)]/20 bg-[var(--primary-blue)]/5 mb-6 sm:mb-8">
                            <Sparkles className="w-4 h-4 text-[var(--primary-blue)]" />
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-blue)]">
                                {spotsLeft} Founding Seats Left
                            </span>
                        </div>

                        {/* Headline — mobile-first responsive sizing */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 italic uppercase leading-[0.9]">
                            The AI Study Partner That Actually{' '}
                            <span className="text-[var(--primary-blue)]">Gets It.</span>
                        </h1>

                        <p className="text-[var(--text-muted)] text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto lg:mx-0 font-medium">
                            Stop searching. Start knowing. Stavlos reads your syllabus so you don't have to.{' '}
                            Be one of the first founding members locking in €5/month forever.
                        </p>

                        {/* Signup Form — full-width stacked on mobile */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mb-8 sm:mb-10 mx-auto lg:mx-0">
                            <div className="relative flex-1">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    placeholder="name@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 sm:h-16 pl-14 pr-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] text-base sm:text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] transition-all"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl"
                                isLoading={isLoading}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Claim Spot
                            </Button>
                        </form>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                            <div className="flex items-center gap-2">LOCK IN €5/MO FOREVER</div>
                            <div className="flex items-center gap-2">JUNE 2026 LAUNCH</div>
                            <div className="flex items-center gap-2">NO CREDIT CARD NEEDED</div>
                        </div>
                    </motion.div>



                </div>
            </div>
        </section>
    )
}
