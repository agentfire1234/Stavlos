'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Upload, MessageSquare, Sparkles } from 'lucide-react'

const steps = [
    {
        number: "01",
        icon: <Upload className="w-6 h-6" />,
        title: "Upload Your Syllabus",
        desc: "Drag & drop your course PDF. Takes 30 seconds."
    },
    {
        number: "02",
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Ask Anything",
        desc: "Ask questions like &apos;When is my biology exam?&apos; or &apos;What are the key topics for Week 4?&apos;"
    },
    {
        number: "03",
        icon: <Sparkles className="w-6 h-6" />,
        title: "Get Instant Answers",
        desc: "Stavlos analyzes your exact curriculum and gives you precise, sourced answers instantly."
    }
]

export function SolutionSection() {
    return (
        <section className="py-24 px-6 bg-[var(--bg-main)]">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How Stavlos Works</h2>
                    <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto italic">
                        Three steps. Two minutes. Never search PDFs again.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative group h-full"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Card Container */}
                            <div className="card-premium p-10 h-full flex flex-col relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-4xl font-black text-[var(--primary-blue)]/20 group-hover:text-[var(--primary-blue)]/40 transition-colors uppercase italic">
                                        {step.number}
                                    </span>
                                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 leading-tight">{step.title}</h3>
                                <p className="text-[var(--text-muted)] text-lg leading-relaxed flex-grow">{step.desc}</p>

                                {/* Decorative Line (Desktop only) */}
                                {index < 2 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-[2px] bg-gradient-to-r from-[var(--border)] to-transparent z-0" />
                                )}
                            </div>

                            {/* Background Glow on Hover */}
                            <div className="absolute inset-0 bg-[var(--primary-blue)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
