'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Mail, PhoneCall, ArrowRight } from 'lucide-react'

type FinalCTAProps = {
    studentsJoined: number
    onSignup: (email: string) => Promise<void> | void
}

export function FinalCTASection({ studentsJoined, onSignup }: FinalCTAProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        try {
            await onSignup(email)
        } catch (e) {
            console.error(e)
            setIsLoading(false)
        } finally {
            // Only set to false if we didn't catch, or just always set it here
            // The task asks to reset it on error.
            // If onSignup succeeds, it might redirect, so setting to false is usually safe.
            setIsLoading(false)
        }
    }

    return (
        <section className="py-16 md:py-32 px-6 section-alt border-t border-[var(--border)] relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-t from-[var(--primary-blue)]/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-6 italic uppercase">Ready to Never Search a Syllabus Again?</h2>
                    <p className="text-[var(--text-muted)] text-xl mb-12 font-medium">
                        Be one of the first founding members.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto mb-8">
                        <div className="relative flex-1">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                placeholder="name@gmail.com"
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
                            className="w-full sm:w-auto"
                        >
                            Claim Spot
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16 text-[10px] sm:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        <div className="flex items-center gap-2">No credit card required</div>
                        <div className="flex items-center gap-2">Launch: June 2026</div>
                        <div className="flex items-center gap-2">Early access (1 week before)</div>
                    </div>


                </motion.div>
            </div>
        </section>
    )
}
