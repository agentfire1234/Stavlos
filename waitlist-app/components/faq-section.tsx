'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
    {
        question: "How does it work?",
        answer: "Simple. You upload your course syllabus PDF. Our AI analyzes every single word, table, and date. Then, you can ask anything—&apos;When is the midterm?&apos;, &apos;Explain the grading policy?&apos;, or &apos;Summarize Week 3 reading.&apos; It knows your exact curriculum."
    },
    {
        question: "What if my professor doesn&apos;t use a syllabus?",
        answer: "Professor without a syllabus? Bold. If they provide any course outline, schedule, or reading list, Stavlos can read it. If it&apos;s literally just vibes, Stavlos might struggle, but most academic docs work perfectly."
    },
    {
        question: "Can I use it for multiple courses?",
        answer: "Absolutely. You can upload all your courses for the semester. Stavlos keeps them organized and understands the context for each one separately."
    },
    {
        question: "Is my data private?",
        answer: "Yes. Your syllabi are processed securely and used only to power your assistant. We don&apos;t sell your data to publishers or university boards. Your study habits are your business."
    },
    {
        question: "When does it launch?",
        answer: "We&apos;re aiming for early March 2026. Join the waitlist now to get 1-week early access before the public launch."
    },
    {
        question: "What if I&apos;m not in the first 2,000?",
        answer: "If you&apos;re outside the first 2,000 students, you&apos;ll still get early access, but the price will be €8/month. However, you can still unlock a permanent 10% discount by referring 2 friends!"
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes. No predatory contracts. If you decide to go back to Ctrl+F&apos;ing your PDFs, you can cancel with one click."
    },
    {
        question: "Do you offer refunds?",
        answer: "If Stavlos doesn&apos;t save you at least 30 minutes of search time in your first week, email me and I&apos;ll refund your first month, no questions asked."
    },
    {
        question: "How does the referral discount work?",
        answer: "Once you join the waitlist, you get a unique link. When 2 friends sign up using your link AND eventually convert to paid users, you unlock a permanent 10% discount on your subscription. Forever."
    }
]

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-24 px-6 bg-[var(--bg-main)]">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Questions? We&apos;ve Got Answers.</h2>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="card-premium overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-[var(--bg-section)]/50 transition-colors"
                            >
                                <span className="font-bold text-lg">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-[var(--primary-blue)]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                                )}
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] bg-[var(--bg-section)]/30">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
