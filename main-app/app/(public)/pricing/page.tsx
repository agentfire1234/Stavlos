'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PricingPage() {
    const [loading, setLoading] = useState(false)

    async function handleUpgrade() {
        setLoading(true)
        try {
            const res = await fetch('/api/stripe/checkout', { method: 'POST' })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Checkout failed')
            }
        } catch (e: any) {
            alert(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        STAVLOS
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 hover:text-white/80 transition text-sm font-medium">Login</Link>
                        <Link href="/login" className="px-5 py-2 bg-white text-black rounded-full hover:bg-white/90 font-bold text-sm transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="pt-32 pb-20 px-6">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <h1 className="text-6xl font-black mb-4 tracking-tighter">Supercharge Your Study</h1>
                    <p className="text-xl text-white/50 font-medium">Stop wasting hours. Start mastering subjects with Llama 3.1.</p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Free Tier */}
                    <div className="p-10 border border-white/10 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-sm flex flex-col">
                        <h2 className="text-2xl font-black mb-2 italic">Starter</h2>
                        <div className="text-4xl font-black mb-6 tracking-tighter">€0<span className="text-lg text-white/40 font-bold">/mo</span></div>
                        <p className="text-white/40 text-sm font-medium mb-8">Essential tools for students on a budget.</p>

                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-500">✓</span> 5 AI Chat messages / day</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-500">✓</span> 1 Syllabus upload</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-500">✓</span> Basic Flashcards</li>
                            <li className="flex gap-3 text-sm font-medium text-white/20"><span className="text-white/10">✕</span> Advanced Essay Outlines</li>
                        </ul>

                        <Link href="/login" className="block w-full py-4 border border-white/10 rounded-2xl text-center font-black uppercase text-xs tracking-widest hover:bg-white/5 transition">
                            Create Account
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-10 border border-blue-500/30 rounded-[2.5rem] bg-blue-600/5 backdrop-blur-sm relative flex flex-col shadow-2xl shadow-blue-600/10">
                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                            Recommended
                        </div>
                        <h2 className="text-2xl font-black mb-2 italic">Stavlos Pro</h2>
                        <div className="text-5xl font-black mb-6 tracking-tighter">€8<span className="text-lg text-white/40 font-bold">/mo</span></div>
                        <p className="text-blue-200/50 text-sm font-medium mb-8">Everything you need to master your GPA.</p>

                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-400">✦</span> Unlimited AI Chat</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-400">✦</span> Infinite Syllabus Context</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-400">✦</span> Advanced Essay Generator</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-400">✦</span> RAG Source Citing</li>
                            <li className="flex gap-3 text-sm font-medium"><span className="text-blue-400">✦</span> Early access to new features</li>
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="block w-full py-5 bg-blue-600 rounded-2xl text-center font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition shadow-xl shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? 'Opening Checkout...' : 'Go Pro Now'}
                        </button>
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-4 leading-relaxed px-4">
                            Waitlist member? Referral discounts applied automatically at checkout! 🎟️
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black mb-16 text-center italic">The Study FAQ</h2>
                    <div className="space-y-12">
                        <FAQ q="Does it actually work for my course?" a="If your course has a text-based PDF syllabus, yes. Stavlos reads the structure, learning objectives, and weightings to give you context-aware help." />
                        <FAQ q="Which AI model powers Stavlos?" a="We use Meta's Llama 3.1 70B for complex reasoning and 8B for instant grammar fixes, ensuring high speed and low latency." />
                        <FAQ q="How do referral discounts work?" a="If you were on our waitlist and referred 2+ friends, you'll see a discounted price during checkout automatically." />
                    </div>
                </div>
            </section>

            <footer className="py-16 text-center text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">
                <p>&copy; 2025 STAVLOS • A BETTER WAY TO LEARN</p>
            </footer>
        </div>
    )
}

function FAQ({ q, a }: { q: string, a: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="font-black text-lg mb-4">{q}</h3>
            <p className="text-white/40 font-medium leading-relaxed text-sm">{a}</p>
        </div>
    )
}

