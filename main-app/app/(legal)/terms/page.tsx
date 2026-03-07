import { TableOfContents, TocItem } from "@/components/legal/toc"

export const metadata = {
    title: "Terms of Service | Stavlos",
    description: "Terms of Service for Stavlos.",
}

const tocItems: TocItem[] = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "who-can-use", title: "2. Who Can Use Stavlos" },
    { id: "your-account", title: "3. Your Account" },
    { id: "free-and-pro-plans", title: "4. Free and Pro Plans" },
    { id: "acceptable-use", title: "5. Acceptable Use" },
    { id: "ai-generated-content", title: "6. AI-Generated Content" },
    { id: "your-content-and-data", title: "7. Your Content and Data" },
    { id: "intellectual-property", title: "8. Intellectual Property" },
    { id: "payments-and-refunds", title: "9. Payments and Refunds" },
    { id: "service-availability", title: "10. Service Availability" },
    { id: "termination", title: "11. Termination" },
    { id: "limitation", title: "12. Limitation of Liability" },
    { id: "changes", title: "13. Changes to These Terms" },
    { id: "contact", title: "14. Contact" },
]

export default function TermsPage() {
    return (
        <div className="max-w-[760px] mx-auto px-5 py-24">
            {/* Header Section */}
            <div className="space-y-6 mb-16">
                <h1 className="text-[clamp(36px,5vw,48px)] font-syne font-bold leading-[1.1]">Terms of Service</h1>
                <p className="text-[#94a3b8] font-dm-sans">Last updated: March 2026</p>

                <div className="bg-blue-500/[0.05] border border-blue-500Border rounded-xl p-6 border-l-4 border-l-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <p className="text-[#e2e8f0] leading-relaxed">
                        The short version: Use Stavlos fairly, don&apos;t abuse it,
                        and we&apos;ll keep building it for you. Full details below.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 relative">
                {/* Table of Contents sidebar */}
                <TableOfContents items={tocItems} />

                {/* Content */}
                <div className="flex-1 space-y-16 text-[#94a3b8] leading-relaxed">

                    <section id="acceptance" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">1. Acceptance of Terms</h2>
                        <p>By accessing or using Stavlos (&quot;the Service&quot;) at stavlos.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
                        <p>These Terms apply to all visitors, users, and others who access or use Stavlos.</p>
                    </section>

                    <section id="who-can-use" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">2. Who Can Use Stavlos</h2>
                        <p>Stavlos is designed for students and educational users. You may use the Service if:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>You are at least 13 years old</li>
                            <li>You are at least 16 years old if you are located in the European Union (in accordance with GDPR)</li>
                            <li>If you are under 18, you have obtained permission from a parent or legal guardian</li>
                            <li>You are not prohibited from using the Service under applicable law</li>
                        </ul>
                        <p>Stavlos is operated by Abraham Alapayo, a sole trader (eenmanszaak) registered in the Netherlands (KvK registration pending). By using the Service, you are entering into a legal agreement with us.</p>
                    </section>

                    <section id="your-account" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">3. Your Account</h2>
                        <p><strong className="text-white">Account Creation</strong><br />
                            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
                        <p><strong className="text-white">Account Security</strong><br />
                            You are responsible for all activity that occurs under your account. If you suspect unauthorized access, notify us immediately at hello@stavlos.com.</p>
                        <p><strong className="text-white">One Account Per Person</strong><br />
                            You may not create multiple accounts to circumvent usage limits or restrictions.</p>
                    </section>

                    <section id="free-and-pro-plans" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">4. Free and Pro Plans</h2>
                        <p><strong className="text-white">Free Plan</strong><br />
                            The free plan includes limited daily AI messages, limited syllabus uploads, and access to selected tools. Free plan limits may change at any time with reasonable notice.</p>
                        <p><strong className="text-white">Pro Plan</strong><br />
                            The Pro plan is a paid subscription at €8/month (or the locked founding price of €5/month for eligible users). Pro plan features include unlimited AI messages, unlimited syllabus uploads, and access to all tools.</p>
                        <p><strong className="text-white">Founding Price</strong><br />
                            Users who joined the waitlist before the 2,000-seat limit was reached and/or referred qualifying friends are eligible for the €5/month founding price. This price is locked for the lifetime of their subscription as long as the subscription remains active and uninterrupted.</p>
                        <p><strong className="text-white">Price Changes</strong><br />
                            We reserve the right to change Pro plan pricing with 30 days notice. Founding price holders are exempt from standard price increases as long as their subscription remains active.</p>
                    </section>

                    <section id="acceptable-use" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">5. Acceptable Use</h2>
                        <p>You agree NOT to:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>Use Stavlos to generate content that is illegal, harmful, abusive, or violates any applicable law</li>
                            <li>Attempt to reverse engineer, scrape, or copy the Service or its AI models</li>
                            <li>Create multiple accounts to abuse free tier limits</li>
                            <li>Share your account credentials with others</li>
                            <li>Use the Service to cheat on exams, assignments, or academic work in ways that violate your institution&apos;s academic integrity policies</li>
                            <li>Attempt to circumvent rate limits or usage restrictions</li>
                            <li>Upload content that infringes third-party intellectual property rights</li>
                            <li>Upload malicious files or content designed to harm the Service or other users</li>
                        </ul>
                        <p><strong className="text-white">Academic Integrity</strong><br />
                            Stavlos is a study tool designed to help you understand your course materials — not to replace your own thinking. How you use AI-generated content in academic submissions is your responsibility. Check your institution&apos;s policies on AI use.</p>
                    </section>

                    <section id="ai-generated-content" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">6. AI-Generated Content</h2>

                        <div className="bg-amber-500/[0.05] border border-amber-500/30 rounded-xl p-6 border-l-4 border-l-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)] my-6">
                            <p className="text-[#e2e8f0] leading-relaxed">
                                Warning: AI can make mistakes. Always verify important information — especially exam dates, deadlines, and grading policies — against your original course materials.
                            </p>
                        </div>

                        <p>Stavlos uses third-party AI models (including but not limited to models from OpenRouter, Google, and Meta) to generate responses. We do not guarantee the accuracy, completeness, or reliability of AI-generated content.</p>
                        <p>AI responses are provided for educational assistance only. Stavlos is not responsible for:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>Errors or inaccuracies in AI responses</li>
                            <li>Academic consequences resulting from reliance on AI-generated content</li>
                            <li>Decisions made based on AI output</li>
                        </ul>
                    </section>

                    <section id="your-content-and-data" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">7. Your Content and Data</h2>
                        <p><strong className="text-white">What You Upload</strong><br />
                            You retain full ownership of all content you upload to Stavlos, including PDF syllabi, notes, and other documents.</p>
                        <p><strong className="text-white">License You Grant Us</strong><br />
                            By uploading content, you grant Stavlos a limited, non-exclusive license to process, store, and analyze your content solely for the purpose of providing the Service to you. We do not use your content to train AI models. We do not sell your content to third parties.</p>
                        <p><strong className="text-white">Deletion</strong><br />
                            You can delete your uploaded content at any time from your account settings. When you delete your account, all your content is permanently deleted within 30 days.</p>
                    </section>

                    <section id="intellectual-property" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">8. Intellectual Property</h2>
                        <p>The Stavlos name, logo, design, and all original content on the platform are owned by Stavlos and protected by applicable intellectual property laws.</p>
                        <p>You may not reproduce, distribute, or create derivative works from any part of Stavlos without express written permission.</p>
                    </section>

                    <section id="payments-and-refunds" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">9. Payments and Refunds</h2>
                        <p><strong className="text-white">Billing</strong><br />
                            Pro subscriptions are billed monthly via Stripe. You authorize us to charge your payment method on a recurring monthly basis.</p>
                        <p><strong className="text-white">Cancellation</strong><br />
                            You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. You retain Pro access until the period ends.</p>
                        <p><strong className="text-white">Refunds</strong><br />
                            We offer a 7-day refund on your first month if you are not satisfied with the Pro plan. After the first month, refunds are issued at our discretion for exceptional circumstances. Contact hello@stavlos.com for refund requests.</p>
                        <p><strong className="text-white">Failed Payments</strong><br />
                            If a payment fails, your account will be downgraded to the free plan. Your data is not deleted. Resubscribing will restore Pro access.</p>

                        <div className="bg-emerald-500/[0.05] border border-emerald-500/30 rounded-xl p-6 border-l-4 border-l-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)] my-6">
                            <p className="text-[#e2e8f0] leading-relaxed">
                                If you cancel your founding price subscription, the €5/month price is permanently lost.
                                Resubscribing will be at the standard rate (€8/month).
                            </p>
                        </div>
                    </section>

                    <section id="service-availability" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">10. Service Availability</h2>
                        <p>We aim for high availability but do not guarantee uninterrupted access. Stavlos may be temporarily unavailable due to:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>Maintenance</li>
                            <li>Third-party service outages (Supabase, Vercel, AI providers)</li>
                            <li>Events outside our control</li>
                        </ul>
                        <p>We are not liable for losses caused by service interruptions.</p>
                    </section>

                    <section id="termination" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">11. Termination</h2>
                        <p><strong className="text-white">By You</strong><br />
                            You can delete your account at any time from settings. This terminates these Terms with respect to your use.</p>
                        <p><strong className="text-white">By Us</strong><br />
                            We reserve the right to suspend or terminate accounts that violate these Terms, with or without notice. Serious violations (illegal activity, abuse, fraud) will result in immediate termination without refund.</p>
                    </section>

                    <section id="limitation" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">12. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by Dutch and EU law, Stavlos and its operator are not liable for:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Loss of data</li>
                            <li>Academic consequences from use of the Service</li>
                            <li>Damages exceeding the amount you paid us in the last 3 months</li>
                        </ul>
                        <p>The Service is provided &quot;as is&quot; without warranties of any kind.</p>
                    </section>

                    <section id="changes" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">13. Changes to These Terms</h2>
                        <p>We may update these Terms at any time. If we make material changes, we will notify you by email and/or a prominent notice on the Service at least 14 days before the changes take effect. Continued use after changes take effect constitutes acceptance.</p>
                    </section>

                    <section id="contact" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">14. Contact</h2>
                        <p>For questions about these Terms:</p>
                        <p className="text-white">
                            <strong>Email:</strong> hello@stavlos.com<br />
                            <strong>Address:</strong> Amersfoort, Netherlands
                        </p>

                        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 mt-8">
                            <p className="text-[#e2e8f0] leading-relaxed">
                                These Terms are governed by Dutch law.
                                Any disputes will be resolved in the courts of the Netherlands.
                            </p>
                        </div>
                    </section>

                    {/* Related Links */}
                    <div className="pt-16 border-t border-white/[0.06] mt-16 text-center space-x-6 text-sm">
                        <span className="text-[#475569]">Also read:</span>
                        <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                        <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                        <a href="mailto:hello@stavlos.com" className="text-blue-400 hover:text-blue-300">Contact Us</a>
                    </div>

                </div>
            </div>
        </div>
    )
}
