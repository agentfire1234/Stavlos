'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Users, Heart, Sparkles } from 'lucide-react'
import { Button } from './ui/button'

const steps = [
    { icon: <Users className="w-5 h-5" />, text: "Refer 2 friends who join the waitlist" },
    { icon: <Heart className="w-5 h-5" />, text: "When they convert to paid, you get 10% off" },
    { icon: <Gift className="w-5 h-5" />, text: "Founding: €5/mo → €4.50/mo FOREVER" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Standard: €8/mo → €7.20/mo if you join later" }
]

export function ReferralBonusSection() {
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
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Get 10% Off Forever</h2>
                    <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto italic">
                        Refer 2 friends, unlock permanent discount.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Left: Explanation */}
                    <motion.div
                        className="card-premium p-8 h-full"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-xl font-bold mb-6">How it works</h3>
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] flex items-center justify-center shrink-0">
                                        {step.icon}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Summary Card */}
                    <motion.div
                        className="card-premium p-8 h-full bg-[var(--primary-blue)] text-white flex flex-col justify-center text-center"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 mx-auto">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">Permanent Reward</h4>
                        <p className="opacity-90 text-sm mb-8 leading-relaxed">
                            Join the waitlist to get your unique referral link.
                            The discount is permanent — as long as you&apos;re a customer, it never expires.
                        </p>
                        <Button variant="secondary" className="w-full bg-white text-[var(--primary-blue)] hover:bg-white/90">
                            Join & Get Your Referral Link
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
