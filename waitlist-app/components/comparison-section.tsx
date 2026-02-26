'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from './ui/button'

const features = [
    {
        label: "Process",
        without: "Manual & Painful",
        with: "Instant & Automated"
    },
    {
        label: "Search Time",
        without: "10+ minutes",
        with: "5 seconds"
    },
    {
        label: "Cost",
        without: "Free but stressful",
        with: "€5/mo (2 coffees)"
    },
    {
        label: "Exam Dates",
        without: "Easy to miss",
        with: "Highlighted & Alerted"
    },
    {
        label: "Course Knowledge",
        without: "Locked in PDFs",
        with: "Unlocked by AI"
    }
]

export function ComparisonSection() {
    return (
        <section className="py-16 md:py-32 px-6 section-alt border-y border-[var(--border)]">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The Old Way vs The Stavlos Way</h2>
                </motion.div>

                <motion.div
                    className="card-premium overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-[var(--bg-main)] border-b border-[var(--border)] p-4 md:p-8">
                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Comparison</div>
                        <div className="text-center text-xs sm:text-sm font-bold text-red-500/80">Without Stavlos</div>
                        <div className="text-center text-xs sm:text-sm font-bold text-[var(--primary-blue)]">With Stavlos</div>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                        {features.map((feature, index) => (
                            <div key={index} className="grid grid-cols-3 p-4 md:p-8 hover:bg-[var(--bg-section)]/50 transition-colors">
                                <div className="text-xs sm:text-sm font-semibold">{feature.label}</div>
                                <div className="text-center text-xs sm:text-sm text-[var(--text-muted)] flex items-center justify-center gap-1 sm:gap-2">
                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/30 shrink-0" />
                                    <span className="hidden sm:inline">{feature.without}</span>
                                    <span className="sm:hidden text-[10px] leading-tight">{feature.without}</span>
                                </div>
                                <div className="text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--success-green)] shrink-0" />
                                    <span className="hidden sm:inline">{feature.with}</span>
                                    <span className="sm:hidden text-[10px] leading-tight">{feature.with}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <Button size="lg" className="px-12">
                        Lock in €5/month
                    </Button>
                </div>
            </div>
        </section>
    )
}
