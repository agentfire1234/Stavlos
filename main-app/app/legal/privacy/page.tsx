import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 selection:bg-blue-500">
            <div className="max-w-3xl mx-auto space-y-16">
                <header className="space-y-6">
                    <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back Home
                    </Link>
                    <h1 className="text-6xl font-black tracking-tight italic">Privacy Policy</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Last Updated: February 2026</p>
                </header>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">1. Information Collection</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            We collect basic account information (email) and syllabus materials you upload to provide custom AI study experiences. We do not sell your data.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">2. AI Training & Isolation</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            Your private syllabus data is isolated and encrypted. We do not use your personal documents to train global AI models.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/80">3. Cookies & Analytics</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-medium">
                            We use essential cookies for authentication and privacy-first analytics to monitor platform health. No cross-site tracking or advertising cookies are deployed.
                        </p>
                    </section>

                    <footer className="pt-24 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                            Stavlos OS • Your Data, Your Future
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}
