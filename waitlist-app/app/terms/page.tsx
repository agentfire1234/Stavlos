import Link from 'next/link'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Nav */}
            <nav className="border-b border-white/10 px-6 py-4">
                <Link href="/" className="text-xl font-bold tracking-tight">STAVLOS</Link>
            </nav>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-gray-400 text-sm">Last updated: February 2026 · Effective: February 2026</p>
                    <div className="mt-6 p-4 border border-white/10 rounded-xl bg-white/5">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            <strong className="text-white">Plain English first:</strong> Use Stavlos for studying. Don't abuse it. Pay your subscription. If something breaks we'll fix it. That's basically it.
                        </p>
                    </div>
                </div>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Who We Are &amp; Who This Is For</h2>
                        <p>Stavlos is an AI-powered study tool operated as a sole proprietorship registered in the Netherlands. These Terms govern your use of the Stavlos website, waitlist, and application.</p>
                        <p className="mt-3">By signing up for the waitlist or creating an account, you agree to these Terms. If you don't agree, don't use Stavlos.</p>
                        <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/5 text-sm">
                            <p><strong className="text-white">Operator:</strong> Stavlos (sole proprietorship, Netherlands)</p>
                            <p className="mt-1"><strong className="text-white">Contact:</strong> hello@stavlos.com</p>
                            <p className="mt-1"><strong className="text-white">Governing law:</strong> Dutch law</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Age Requirements</h2>
                        <p>You must be at least 13 to use Stavlos. If you're between 13–16, your parent or guardian must consent. If you're under 13, you may not use Stavlos.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Your Account</h2>
                        <h3 className="text-lg font-semibold text-white mb-2">3.1 Creating an Account</h3>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>Provide accurate information when signing up</li>
                            <li>Keep your password secure and do not share it</li>
                            <li>Tell us immediately if your account is compromised</li>
                            <li>Be responsible for everything under your account</li>
                        </ul>
                        <h3 className="text-lg font-semibold text-white mb-2 mt-6">3.2 One Account Per Person</h3>
                        <p>Creating multiple accounts to abuse free tier limits or referral rewards is not allowed and will result in all accounts being banned.</p>
                        <h3 className="text-lg font-semibold text-white mb-2 mt-6">3.3 Account Deletion</h3>
                        <p>You can delete your account from Settings anytime. We'll delete your data within 30 days, except where legally required.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. What You Can and Can't Do</h2>
                        <h3 className="text-lg font-semibold text-white mb-3">✅ You CAN:</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Use Stavlos for your own personal studying</li>
                            <li>Upload your own syllabuses and course materials</li>
                            <li>Ask the AI anything related to your studies</li>
                            <li>Share content Stavlos generates with classmates</li>
                            <li>Cancel your subscription whenever you want</li>
                            <li>Export your data at any time</li>
                        </ul>
                        <h3 className="text-lg font-semibold text-white mb-3 mt-6">❌ You CANNOT:</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Use Stavlos to cheat on exams in ways prohibited by your institution</li>
                            <li>Share your account with others</li>
                            <li>Use Stavlos to generate harmful, illegal, or offensive content</li>
                            <li>Attempt to reverse-engineer, scrape, or copy Stavlos</li>
                            <li>Use bots to spam the service</li>
                            <li>Upload copyrighted materials you don't have rights to</li>
                            <li>Abuse the free tier or referral system</li>
                            <li>Resell or sublicense access to Stavlos</li>
                            <li>Attempt to access other users' accounts or data</li>
                        </ul>
                        <div className="mt-6 p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5">
                            <p className="text-yellow-400 text-sm font-semibold">Note on Academic Integrity</p>
                            <p className="text-sm mt-2">Stavlos is a study tool, not a cheating tool. Using AI to learn and understand concepts is fine. Submitting AI-generated work as your own without disclosure may violate your institution's academic integrity policy — that's your responsibility, not ours.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Pricing &amp; Payment</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Free Plan", desc: "Available to all users with limited features. Free plan limits may change with reasonable notice." },
                                { title: "Pro Plan", desc: "A monthly subscription. Your card is charged monthly on the same date you signed up. Payments processed by Stripe." },
                                { title: "Early Bird Pricing", desc: "The first 2,000 users on the waitlist get €5/month forever (standard: €8/month). This price is locked in by default for these users." },
                                { title: "Referral Rewards", desc: "Referring 1 friend locks in your €5/month founding price regardless of your waitlist position. Referring 2 friends earns you your first month completely free." },
                                { title: "Price Changes", desc: "We may change prices with at least 30 days notice. Early bird and referral-locked pricing is excluded from standard increases as long as your subscription stays active." },
                                { title: "Failed Payments", desc: "If your payment fails, we'll retry up to 3 times in 7 days. After that, your account is downgraded to free until you update your payment method." },
                            ].map((item) => (
                                <div key={item.title} className="p-4 border border-white/10 rounded-xl">
                                    <p className="font-semibold text-white">{item.title}</p>
                                    <p className="text-sm mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Refund Policy</h2>
                        <div className="space-y-4">
                            {[
                                { title: "New subscribers", desc: "Not satisfied within your first 7 days? Email hello@stavlos.com for a full refund. No questions asked." },
                                { title: "After 7 days", desc: "No refunds for partial months. If you cancel mid-month, you keep access until the end of the period you paid for." },
                                { title: "Service outages", desc: "If Stavlos is unavailable for more than 24 consecutive hours due to our fault, we'll extend your subscription by the equivalent number of days." },
                                { title: "EU Consumer Rights", desc: "As an EU customer, you have a 14-day right of withdrawal from the date of your first payment. This right is waived once you start actively using the service (i.e., send your first message or upload your first file)." },
                            ].map((item) => (
                                <div key={item.title} className="p-4 border border-white/10 rounded-xl">
                                    <p className="font-semibold text-white">{item.title}</p>
                                    <p className="text-sm mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Cancellation</h2>
                        <p>Cancel your subscription anytime from Settings → Billing. Cancellation takes effect at the end of your current billing period. You won't be charged again after cancelling.</p>
                        <p className="mt-3">We may terminate accounts that violate these Terms. Serious violations may result in immediate termination without notice.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. AI &amp; Content</h2>
                        <h3 className="text-lg font-semibold text-white mb-2">8.1 AI Accuracy</h3>
                        <p>Stavlos uses AI to generate responses. AI can make mistakes. Always verify important information from official sources. Don't rely on Stavlos for medical, legal, or financial decisions.</p>
                        <h3 className="text-lg font-semibold text-white mb-2 mt-4">8.2 Your Content</h3>
                        <p>You own everything you upload. By uploading, you give us permission to process it to provide the service. We don&apos;t claim ownership of your content.</p>
                        <h3 className="text-lg font-semibold text-white mb-2 mt-4">8.3 AI Output</h3>
                        <p>You can use AI-generated responses for your studies. You cannot resell AI-generated content from Stavlos as your own product.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Availability &amp; Uptime</h2>
                        <p>We aim to keep Stavlos available 24/7 but can't guarantee it. We may take the service down for maintenance and will try to give advance notice when possible.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>Stavlos is provided &quot;as is&quot; without warranties of any kind</li>
                            <li>We are not liable for any indirect or consequential damages</li>
                            <li>Our total liability to you is limited to the amount you paid us in the last 3 months</li>
                            <li>We are not responsible for decisions you make based on AI-generated content</li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-400">Note: EU consumer rights always apply regardless of these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Intellectual Property</h2>
                        <p>Stavlos, its logo, design, and code are owned by us. You keep ownership of all content you upload. We keep ownership of the platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Changes to These Terms</h2>
                        <p>For significant changes, we'll email you at least 14 days in advance. Continuing to use Stavlos after changes take effect means you accept the new Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law &amp; Disputes</h2>
                        <p>These Terms are governed by Dutch law. Disputes will be handled by Dutch courts in Amsterdam. EU customers also have access to the EU Online Dispute Resolution platform at{" "}
                            <a href="https://ec.europa.eu/consumers/odr" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
                        <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-sm space-y-2">
                            <p><strong className="text-white">Email:</strong> <a href="mailto:hello@stavlos.com" className="text-blue-400 hover:underline">hello@stavlos.com</a></p>
                            <p><strong className="text-white">Response time:</strong> Within 5 business days</p>
                            <p><strong className="text-white">Language:</strong> Dutch or English</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 Stavlos. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors opacity-20">Admin</Link>
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors font-bold">Back to Stavlos</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
