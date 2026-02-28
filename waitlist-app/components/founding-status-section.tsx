'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Target, MessageCircle, Lock, BarChart3 } from 'lucide-react'
import { Badge } from './ui/badge'

const benefits = [
    { icon: <Crown className="w-5 h-5" />, title: "Founding Member Badge", desc: "Exclusive profile flair forever" },
    { icon: <Target className="w-5 h-5" />, title: "Shape the Product", desc: "Your feedback = features we build" },
    { icon: <MessageCircle className="w-5 h-5" />, title: "Direct Access to Founder", desc: "Talk to Abraham directly" },
    { icon: <Lock className="w-5 h-5" />, title: "Price Protection", desc: "€5/mo forever, even as we grow" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Behind the Scenes", desc: "Build-in-public updates" }
]

type FoundingStatusProps = {
    currentSpots: number
    totalSpots: number
}

export function FoundingStatusSection({ currentSpots, totalSpots }: FoundingStatusProps) {
    const percentage = Math.round((currentSpots / totalSpots) * 100)

    return (
        <section className="py-16 md:py-32 px-6 section-alt border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Founding Student Status</h2>
                        <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
                            You&apos;re not just getting a discount. You&apos;re becoming a founding member of the study tool that actually works for you.
                        </p>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] flex items-center justify-center shrink-0">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{benefit.title}</h4>
                                        <p className="text-[var(--text-muted)] text-sm">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Progress Visual */}
                    <motion.div
                        className="card-premium p-10 md:p-12 text-center flex flex-col items-center justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="primary" className="mb-6 uppercase tracking-[0.2em] font-black">
                            Founding Tier Progress
                        </Badge>

                        {currentSpots >= 50 && (
                            <div className="relative w-48 h-48 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="transparent"
                                        stroke="var(--border)"
                                        strokeWidth="12"
                                    />
                                    <motion.circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="transparent"
                                        stroke="var(--primary-blue)"
                                        strokeWidth="12"
                                        strokeDasharray={2 * Math.PI * 88}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                        whileInView={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - currentSpots / totalSpots) }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">{percentage}%</span>
                                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Filled</span>
                                </div>
                            </div>
                        )}

                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                                <span className="text-[var(--text-muted)]">Current Spots</span>
                                <span className="text-[var(--primary-blue)]">{currentSpots.toLocaleString()} / {totalSpots.toLocaleString()}</span>
                            </div>
                            <div className="h-3 bg-[var(--bg-section)] rounded-full overflow-hidden border border-[var(--border)]">
                                <motion.div
                                    className="h-full bg-[var(--primary-blue)]"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                />
                            </div>
                            <p className="text-sm font-medium text-[var(--text-muted)]">
                                Once we hit {totalSpots.toLocaleString()}, price goes to €8/month. <br />
                                <span className="text-[var(--primary-blue)] font-bold">No exceptions.</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
