import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 selection:bg-blue-500">
            <div className="max-w-3xl mx-auto space-y-16">
                <header className="space-y-6">
                    <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back Home
                    </Link>
                    <h1 className="text-6xl font-black tracking-tight italic">Terms of Service</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Last Updated: February 2026</p>
                </header>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">1. Acceptance of Terms</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            By accessing Stavlos, you agree to be bound by these terms. If you do not agree to any part of these terms, you may not use the service. We provide an AI-powered study platform designed to enhance your educational experience.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">2. Usage & Fair Play</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            Stavlos is intended for educational assistance. While our AI is advanced, users are responsible for verifying the accuracy of information for graded work. Misuse of the platform (scraping, budget-bypassing, or malicious prompts) will result in permanent suspension.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">3. Subscriptions & Refunds</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            Pro subscriptions are billed monthly. You can cancel at any time via the billing portal. Refunds are handled on a case-by-case basis within 48 hours of original purchase if services have not been substantially consumed.
                        </p>
                    </section>

                    <footer className="pt-24 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                            Stavlos OS • Excellence in Education
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}
