import Link from 'next/link'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        STAVLOS
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 hover:text-white/80 transition">Login</Link>
                        <Link href="/login" className="px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 font-medium transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="pt-32 pb-20 px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">Invest in Your GPA</h1>
                    <p className="text-xl text-white/50">Cheaper than a tutor. Smarter than a textbook.</p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Tier */}
                    <div className="p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-2">Free Starter</h2>
                        <div className="text-4xl font-bold mb-6">€0<span className="text-lg text-white/40">/mo</span></div>
                        <p className="text-white/60 mb-8">For casual study help.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3"><span className="text-blue-500">✓</span> 5 AI Chat messages / day</li>
                            <li className="flex gap-3"><span className="text-blue-500">✓</span> 1 Syllabus upload</li>
                            <li className="flex gap-3"><span className="text-blue-500">✓</span> Basic Flashcards</li>
                            <li className="flex gap-3 text-white/30"><span className="text-white/20">✕</span> Essay Outlines</li>
                        </ul>

                        <Link href="/login" className="block w-full py-3 border border-white/20 rounded-xl text-center font-semibold hover:bg-white/5 transition">
                            Start Free
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-8 border-2 border-blue-500 rounded-3xl bg-blue-900/10 backdrop-blur-sm relative transform md:scale-105">
                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Stavlos Pro</h2>
                        <div className="text-5xl font-bold mb-6">€8<span className="text-lg text-white/40">/mo</span></div>
                        <p className="text-blue-200/80 mb-8">For serious students.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3"><span className="text-blue-400">✦</span> Unlimited AI Chat</li>
                            <li className="flex gap-3"><span className="text-blue-400">✦</span> 50 Syllabus uploads</li>
                            <li className="flex gap-3"><span className="text-blue-400">✦</span> Advanced Essay Outlines</li>
                            <li className="flex gap-3"><span className="text-blue-400">✦</span> RAG "Source Citing"</li>
                            <li className="flex gap-3"><span className="text-blue-400">✦</span> Priority Support</li>
                        </ul>

                        <Link href="/login" className="block w-full py-4 bg-blue-600 rounded-xl text-center font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20">
                            Get Pro Access
                        </Link>
                        <p className="text-center text-xs text-white/40 mt-3">
                            Waitlist member? You might have a discount!
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
                    <div className="space-y-8">
                        <FAQ q="Does it work for any subject?" a="Yes! Stavlos reads any text-based PDF syllabus. Works best for Humanities, Social Sciences, and Business courses." />
                        <FAQ q="Can I cancel anytime?" a="Absolutely. Manage your subscription in settings. No hidden fees." />
                        <FAQ q="What AI model do you use?" a="We use a smart mix of GPT-4o and Claude 3.5 Sonnet to give you the best answers at the lowest price." />
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-white/30 text-sm">
                <p>&copy; 2025 STAVLOS.</p>
            </footer>
        </div>
    )
}

function FAQ({ q, a }: { q: string, a: string }) {
    return (
        <div>
            <h3 className="font-bold text-lg mb-2">{q}</h3>
            <p className="text-white/60 leading-relaxed">{a}</p>
        </div>
    )
}
