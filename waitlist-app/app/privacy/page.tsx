import Link from 'next/link'

export default function PrivacyPolicy() {
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
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm">Last updated: June 2026 · Effective: June 2026</p>
                    <div className="mt-6 p-4 border border-white/10 rounded-xl bg-white/5">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            <strong className="text-white">Plain English first:</strong> We collect your email to keep you updated about Stavlos. We collect basic usage data to make the product better. We don't sell your data. Ever.
                        </p>
                    </div>
                </div>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Who We Are</h2>
                        <p>Stavlos is an AI-powered study tool built and operated as a sole proprietorship registered in the Netherlands.</p>
                        <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/5 text-sm">
                            <p><strong className="text-white">Business address:</strong> Netherlands (full address provided upon KVK registration)</p>
                            <p className="mt-1"><strong className="text-white">Contact:</strong> privacy@stavlos.com</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. What Data We Collect</h2>
                        <h3 className="text-lg font-semibold text-white mb-2">2.1 Waitlist Data</h3>
                        <p>When you join the Stavlos waitlist, we collect:</p>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>Your email address</li>
                            <li>Your waitlist position and sign-up timestamp</li>
                            <li>Your referral code and how many people you referred</li>
                            <li>The referral code of whoever referred you (if any)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mb-2 mt-6">2.2 Product Data (When App Launches)</h3>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>Account information (email, password hash — never plain text)</li>
                            <li>Messages you send to the AI (to provide the service)</li>
                            <li>Files you upload (syllabuses, documents)</li>
                            <li>Usage data (how often you use features, session duration)</li>
                            <li>Payment information (processed by Stripe — we never see your card details)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mb-2 mt-6">2.3 Automatic Data</h3>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>IP address (for security and fraud prevention)</li>
                            <li>Browser type and device information</li>
                            <li>Pages visited and time spent on them</li>
                            <li>Referral source (how you found us)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mb-2 mt-6">2.4 What We Don't Collect</h3>
                        <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                            <li>Your real name (unless you give it to us)</li>
                            <li>Your phone number</li>
                            <li>Your location (beyond country, for tax purposes)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Why We Collect It</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Email address", desc: "To send you waitlist updates, launch notifications, and product emails. You can unsubscribe anytime." },
                                { title: "Messages & uploaded files", desc: "To provide the AI study service. Your messages are sent to our AI provider (Groq/OpenRouter) to generate responses. They are not used to train AI models." },
                                { title: "Usage data", desc: "To understand how people use Stavlos and make it better. We look at patterns, not individual users." },
                                { title: "Payment data", desc: "To process your subscription. Handled entirely by Stripe. We only see that you paid and when." },
                                { title: "Referral data", desc: "To track referrals and apply your €5 price lock or free month bonus reward. That's it." },
                            ].map((item) => (
                                <div key={item.title} className="p-4 border border-white/10 rounded-xl">
                                    <p className="font-semibold text-white">{item.title}</p>
                                    <p className="text-sm mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Who We Share Data With</h2>
                        <p className="mb-4">We don't sell your data. We only share with services that help us run Stavlos:</p>
                        <div className="space-y-3">
                            {[
                                { name: "Supabase", use: "Database hosting", location: "EU" },
                                { name: "Vercel", use: "Website hosting", location: "EU/US" },
                                { name: "Resend", use: "Sending emails to you", location: "US" },
                                { name: "Stripe", use: "Processing payments", location: "US" },
                                { name: "Groq", use: "AI responses for chat", location: "US" },
                                { name: "OpenRouter", use: "AI responses for syllabus analysis", location: "US" },
                                { name: "Upstash", use: "Caching (speeds up the app)", location: "EU" },
                            ].map((service) => (
                                <div key={service.name} className="p-3 border border-white/10 rounded-lg flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-white text-sm">{service.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{service.use}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0">{service.location}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm">All US-based services are covered by Standard Contractual Clauses (SCCs) as required by GDPR.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Your GDPR Rights</h2>
                        <div className="space-y-3">
                            {[
                                { right: "Right to Access", desc: "Ask us what data we have about you. We'll send it within 30 days." },
                                { right: "Right to Correction", desc: "Ask us to fix incorrect data about you." },
                                { right: "Right to Deletion", desc: "Ask us to delete all your data ('right to be forgotten')." },
                                { right: "Right to Portability", desc: "Ask for your data in a machine-readable format." },
                                { right: "Right to Object", desc: "Object to how we process your data." },
                                { right: "Right to Restrict", desc: "Ask us to stop processing your data temporarily." },
                                { right: "Right to Withdraw Consent", desc: "Unsubscribe from emails or delete your account anytime." },
                            ].map((item) => (
                                <div key={item.right} className="p-3 border border-white/10 rounded-lg">
                                    <p className="font-semibold text-white text-sm">{item.right}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm">
                            To exercise any of these rights, email{" "}
                            <a href="mailto:privacy@stavlos.com" className="text-blue-400 hover:underline">privacy@stavlos.com</a>.
                            We respond within 30 days. You can also file a complaint at{" "}
                            <a href="https://autoriteitpersoonsgegevens.nl" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">autoriteitpersoonsgegevens.nl</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. How Long We Keep Your Data</h2>
                        <div className="space-y-3">
                            {[
                                { type: "Waitlist data", duration: "Until launch + 90 days, or until you ask us to delete it" },
                                { type: "Account data", duration: "As long as you have an account, plus 30 days after deletion" },
                                { type: "Payment records", duration: "7 years (required by Dutch tax law)" },
                                { type: "AI chat messages", duration: "90 days, then automatically deleted" },
                                { type: "Uploaded files (syllabuses)", duration: "Until you delete them, or when you close your account" },
                                { type: "Usage/analytics data", duration: "12 months, then anonymized" },
                            ].map((item) => (
                                <div key={item.type} className="flex gap-4 py-2 border-b border-white/5">
                                    <p className="text-white text-sm font-medium w-48 shrink-0">{item.type}</p>
                                    <p className="text-gray-400 text-sm">{item.duration}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
                        <p className="mb-4">We use minimal cookies. No advertising cookies, no tracking pixels, no Google Analytics.</p>
                        <div className="space-y-3">
                            {[
                                { name: "Session cookie", purpose: "Keeps you logged in", required: true },
                                { name: "Preference cookie", purpose: "Remembers your settings", required: true },
                                { name: "Analytics cookie", purpose: "Understands how you use the app (anonymized)", required: false },
                            ].map((cookie) => (
                                <div key={cookie.name} className="p-3 border border-white/10 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">{cookie.name}</p>
                                        <p className="text-xs text-gray-400">{cookie.purpose}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${cookie.required ? "bg-white/10 text-gray-300" : "bg-blue-500/20 text-blue-400"}`}>
                                        {cookie.required ? "Required" : "Optional"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Security</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>All data is encrypted in transit (HTTPS/TLS)</li>
                            <li>Passwords are hashed using bcrypt (we never store plain text)</li>
                            <li>Database access is restricted and monitored</li>
                            <li>We use Row Level Security (RLS) in our database</li>
                            <li>API keys are never exposed to the frontend</li>
                        </ul>
                        <p className="mt-4 text-sm">
                            Found a vulnerability? Report it to{" "}
                            <a href="mailto:security@stavlos.com" className="text-blue-400 hover:underline">security@stavlos.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Age Requirements</h2>
                        <p>Stavlos is designed for students aged 13 and older. If you are under 16, you may need parental consent depending on your country's laws.</p>
                        <p className="mt-3">We do not knowingly collect data from children under 13. Contact us at <a href="mailto:privacy@stavlos.com" className="text-blue-400 hover:underline">privacy@stavlos.com</a> if you believe this has happened.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                        <p>For significant changes, we'll email you at least 14 days in advance. The date at the top of this page always shows when it was last updated.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                        <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-sm space-y-2">
                            <p><strong className="text-white">Email:</strong> <a href="mailto:privacy@stavlos.com" className="text-blue-400 hover:underline">privacy@stavlos.com</a></p>
                            <p><strong className="text-white">Response time:</strong> Within 5 business days</p>
                            <p><strong className="text-white">Language:</strong> Dutch or English</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 Stavlos. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Back to Stavlos</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
