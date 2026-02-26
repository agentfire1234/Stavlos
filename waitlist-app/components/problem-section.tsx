'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function ProblemSection() {
    const problems = [
        {
            title: "The midnight scramble",
            desc: "It's 11:30 PM. You know there's a reading due tomorrow, but you can't find the link in the 40-page syllabus."
        },
        {
            title: "The 'Ctrl+F' nightmare",
            desc: "Searching for 'midterm' gives 42 results. None of them are the actual date. You just want to know when to study."
        },
        {
            title: "Deadlines that bite",
            desc: "Missing a 10% assignment because it was hidden in a table on page 14. We've all been there."
        },
        {
            title: "Zero organization",
            desc: "Four courses, four different syllabus styles, zero consistency. It's a full-time job just to stay organized."
        }
    ]

    return (
        <section className="py-16 md:py-32 px-6 section-alt">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight italic uppercase">College is hard.</h2>
                    <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto font-medium">
                        Studying is hard enough. Finding out &apos;how&apos; to study shouldn&apos;t be.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {problems.map((prob, index) => (
                        <motion.div
                            key={index}
                            className="card-premium p-8 group border-red-500/10 hover:border-red-500/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-red-500 transition-colors uppercase italic">{prob.title}</h3>
                            <p className="text-[var(--text-muted)] leading-relaxed font-medium">{prob.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
