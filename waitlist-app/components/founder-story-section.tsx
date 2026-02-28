'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'

export function FounderStorySection() {
    return (
        <section className="py-16 md:py-32 px-6 section-alt">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight italic">Built by a Student, For Students</h2>
                        <div className="space-y-6 text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                            <p>Hi, I'm Abraham. I'm 14.</p>
                            <p>
                                I built Stavlos because I was tired of searching through syllabi at midnight, missing deadlines,
                                and feeling disorganized.
                            </p>
                            <p className="font-semibold text-[var(--headline)]">
                                Most 'student tools' are built by people who haven't been in a classroom in 20 years. They don't get it.
                            </p>
                            <p>
                                Stavlos is different because I'm actually a student, I use it for my own courses, and I understand the pain.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Narrative Card */}
                    <motion.div
                        className="card-premium p-10 relative overflow-hidden group border-[var(--primary-blue)]/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Gamepad2 className="w-32 h-32" />
                        </div>

                        <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">The Vision</h3>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]">
                                <p><strong>Why €5/month?</strong></p>
                                <p className="mt-1 text-[var(--text-muted)]">Less than 2 coffees, or the stress of missing one deadline.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--primary-blue)] text-white">
                                <p><strong>The PC Goal</strong></p>
                                <p className="mt-1 opacity-90">If 500 students join, I get my gaming PC. If 5,000 join, I&apos;ve built a real business.</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[var(--border)]">
                            <p className="text-xl font-bold italic">&quot;Let&apos;s do this together.&quot;</p>
                            <p className="text-[var(--text-muted)] text-sm mt-1">— Abraham, Founder</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
