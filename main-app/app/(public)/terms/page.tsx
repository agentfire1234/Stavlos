export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-4xl font-black italic mb-4">Terms of Service</h1>
                <p className="text-white/40 font-medium">Last Updated: February 13, 2026</p>
            </header>

            <section className="space-y-6 text-white/70 leading-relaxed font-medium">
                <p>By using Stavlos, you agree to the following terms. Please read them carefully.</p>

                <h2 className="text-xl font-black text-white italic">1. Service Description</h2>
                <p>Stavlos is an AI-powered study tool. While we strive for absolute accuracy, AI can occasionally generate incorrect information. Always cross-reference with your official course materials.</p>

                <h2 className="text-xl font-black text-white italic">2. User Responsibilities</h2>
                <p>You are responsible for the content you upload. You must own the rights to the syllabuses or course materials you process with Stavlos.</p>

                <h2 className="text-xl font-black text-white italic">3. Pro Subscriptions</h2>
                <p>Stavlos Pro unlocks unlimited chat and advanced RAG features. Subscriptions are billed monthly and can be cancelled anytime.</p>

                <h2 className="text-xl font-black text-white italic">4. Limitation of Liability</h2>
                <p>Stavlos is a study assistant, not a substitute for academic effort. We are not liable for any academic performance outcomes or grades.</p>
            </section>

            <footer className="pt-12 border-t border-white/10 text-white/20 text-xs font-black uppercase tracking-widest">
                Stavlos AI • Built for Students
            </footer>
        </div>
    )
}
