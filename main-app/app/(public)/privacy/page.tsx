export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-4xl font-black italic mb-4">Privacy Policy</h1>
                <p className="text-white/40 font-medium">Effective Date: February 13, 2026</p>
            </header>

            <section className="space-y-6 text-white/70 leading-relaxed font-medium">
                <p>Welcome to Stavlos. Your privacy is paramount. This policy outlines how we handle your data when you use our AI study partner platform.</p>

                <h2 className="text-xl font-black text-white italic">1. Data We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Email and profile data from Supabase Auth.</li>
                    <li><strong>Syllabus Content:</strong> PDF text extracted for RAG (Retrieval-Augmented Generation). These are stored in an encrypted vector database.</li>
                    <li><strong>Usage Data:</strong> AI interaction logs, token counts, and cost tracking for billing.</li>
                </ul>

                <h2 className="text-xl font-black text-white italic">2. AI & Data Processing</h2>
                <p>We use third-party providers including Meta (Llama 3.1) and Groq. Your syllabus data is only sent to these providers to generate responses and is not used to train their global models.</p>

                <h2 className="text-xl font-black text-white italic">3. Payments</h2>
                <p>Payment processing is handled securely by Stripe. We do not store credit card details on our servers.</p>

                <h2 className="text-xl font-black text-white italic">4. Your Rights</h2>
                <p>You can delete your account and all associated syllabus data at any time through the dashboard settings.</p>
            </section>

            <footer className="pt-12 border-t border-white/10 text-white/20 text-xs font-black uppercase tracking-widest">
                Stavlos AI • Built for Students
            </footer>
        </div>
    )
}
