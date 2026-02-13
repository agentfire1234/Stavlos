import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        STAVLOS
                    </div>
                    <div className="flex gap-6 text-sm text-white/60">
                        <Link href="#features" className="hover:text-white transition">Features</Link>
                        <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
                        <Link href="/login" className="hover:text-white transition">Login</Link>
                        <Link href="/login" className="px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 font-medium transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm text-sm text-blue-400">
                        ✨ AI Study Partner for Students
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Stop Staring.<br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Start Mastering.
                        </span>
                    </h1>
                    <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
                        Upload your syllabus. Stavlos creates a personalized study plan,
                        generating quizzes, essays, and notes instantly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login" className="px-8 py-4 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                            Start for Free <span className="text-xl">→</span>
                        </Link>
                        <Link href="#demo" className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition">
                            Watch Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats / Social Proof */}
            <div className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 flex justify-center gap-16 text-center">
                    <div>
                        <p className="text-3xl font-bold">12k+</p>
                        <p className="text-sm text-white/40">Students Waiting</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">50k+</p>
                        <p className="text-sm text-white/40">Syllabi Analyzed</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">4.9/5</p>
                        <p className="text-sm text-white/40">Average Rating</p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 text-center">Everything you need to ace the semester</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="📚"
                            title="Syllabus Integration"
                            desc="Upload your PDF syllabus. Stavlos knows exactly what you need to study and when."
                        />
                        <FeatureCard
                            icon="💡"
                            title="Smart Flashcards"
                            desc="Automatically generates active recall flashcards from your course materials."
                        />
                        <FeatureCard
                            icon="✍️"
                            title="Essay Outliner"
                            desc="Stuck on a paper? Get instant outlines with sources cited from your readings."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Teaser */}
            <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-black to-blue-900/10">
                <div className="max-w-3xl mx-auto text-center border border-white/10 p-12 rounded-3xl bg-white/5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl">EARLY BIRD</div>
                    <h2 className="text-3xl font-bold mb-4">Simple, Student-Friendly Pricing</h2>
                    <div className="text-5xl font-bold mb-2">€8<span className="text-xl text-white/40">/mo</span></div>
                    <p className="text-white/40 mb-8">Less than 2 coffees a month.</p>

                    <ul className="text-left max-w-xs mx-auto space-y-3 mb-10 text-white/80">
                        <li className="flex gap-2">✅ Unlimited Chat</li>
                        <li className="flex gap-2">✅ 50 PDF Uploads</li>
                        <li className="flex gap-2">✅ Exam Mode</li>
                        <li className="flex gap-2">✅ Priority Support</li>
                    </ul>

                    <Link href="/login" className="block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition">
                        Get Started Now
                    </Link>
                    <p className="mt-4 text-xs text-white/30">Free tier available with daily limits.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10 text-center text-white/30 text-sm">
                <p>&copy; 2025 STAVLOS. Built by Students, for Students.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-white/60 leading-relaxed">{desc}</p>
        </div>
    )
}
