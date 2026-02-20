'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const features = [
    "Unlimited syllabus uploads",
    "Unlimited questions",
    "All your courses in one place",
    "Smart exam reminders",
    "Priority support",
    "Early feature access",
    "Price locked forever"
]

export function WhatIncludedSection() {
    return (
        <section className="py-24 px-6 bg-[var(--bg-main)]">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">What You Get as a Founding Student</h2>
                    <p className="text-[var(--text-muted)] text-lg italic">
                        Lock in €5/month forever (normally €8)
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-section)]"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <div className="w-6 h-6 rounded-full bg-[var(--success-green)]/10 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-[var(--success-green)]" />
                            </div>
                            <span className="font-semibold text-lg">{feature}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-16 p-8 rounded-3xl border border-[var(--primary-blue)]/20 bg-[var(--primary-blue)]/5 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-2xl mx-auto">
                        Average student uses ~180 questions/month. Heavy users during finals: ~450 questions/month.
                        Our cost: ~€0.02/month. Your price: €5/month. <br />
                        <strong className="text-[var(--headline)]">So yes, truly unlimited.</strong>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
