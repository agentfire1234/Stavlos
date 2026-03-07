import { TableOfContents, TocItem } from "@/components/legal/toc"

export const metadata = {
    title: "Privacy Policy | Stavlos",
    description: "Privacy Policy for Stavlos.",
}

const tocItems: TocItem[] = [
    { id: "who-we-are", title: "1. Who We Are" },
    { id: "what-data-we-collect", title: "2. What Data We Collect" },
    { id: "how-we-use", title: "3. How We Use Your Data" },
    { id: "legal-basis", title: "4. Legal Basis for Processing (GDPR)" },
    { id: "data-storage", title: "5. Data Storage and Security" },
    { id: "third-party", title: "6. Third-Party Services" },
    { id: "ai-and-data", title: "7. AI and Your Data" },
    { id: "rights-gdpr", title: "8. Your Rights (GDPR)" },
    { id: "rights-usa", title: "8b. Your Rights (USA — CCPA/CPRA)" },
    { id: "cookies", title: "9. Cookies" },
    { id: "childrens-privacy", title: "10. Children's Privacy" },
    { id: "data-retention", title: "11. Data Retention" },
    { id: "changes", title: "12. Changes to This Policy" },
    { id: "contact", title: "13. Contact and Data Requests" },
]

export default function PrivacyPage() {
    return (
        <div className="max-w-[760px] mx-auto px-5 py-24">
            {/* Header Section */}
            <div className="space-y-6 mb-16 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-xs font-semibold text-[#94a3b8] mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    GDPR Compliant · Data stored in EU
                </div>

                <h1 className="text-[clamp(36px,5vw,48px)] font-syne font-bold leading-[1.1]">Privacy Policy</h1>
                <p className="text-[#94a3b8] font-dm-sans">Last updated: March 2026</p>

                <div className="bg-blue-500/[0.05] border border-blue-500/30 rounded-xl p-6 border-l-4 border-l-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <p className="text-[#e2e8f0] leading-relaxed">
                        The short version: We collect only what we need,
                        we don&apos;t sell your data, and you can delete
                        everything anytime. Full details below.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 relative">
                {/* Table of Contents sidebar */}
                <TableOfContents items={tocItems} />

                {/* Content */}
                <div className="flex-1 space-y-16 text-[#94a3b8] leading-relaxed">

                    <section id="who-we-are" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">1. Who We Are</h2>
                        <p>Stavlos is operated by Abraham Alapayo, a sole trader based in Amersfoort, Netherlands (KvK registration pending).</p>
                        <p className="text-white mt-4">
                            <strong>Data Controller:</strong><br />
                            Abraham Alapayo<br />
                            Amersfoort, Netherlands<br />
                            <a href="mailto:hello@stavlos.com" className="text-blue-400 hover:text-blue-300">hello@stavlos.com</a>
                        </p>
                        <p>For GDPR purposes, Abraham Alapayo is the data controller for all personal data processed through stavlos.com.</p>
                    </section>

                    <section id="what-data-we-collect" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">2. What Data We Collect</h2>
                        <h3 className="text-lg font-bold text-white pt-2">2a. Data You Provide</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Data</th>
                                        <th className="py-3 px-4 font-semibold">When</th>
                                        <th className="py-3 px-4 font-semibold">Why</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Email address</td><td className="py-3 px-4">Sign up</td><td className="py-3 px-4">Account creation, login, notifications</td></tr>
                                    <tr><td className="py-3 px-4">Display name</td><td className="py-3 px-4">Profile setup</td><td className="py-3 px-4">Personalization</td></tr>
                                    <tr><td className="py-3 px-4">School/university</td><td className="py-3 px-4">Profile (optional)</td><td className="py-3 px-4">Personalization</td></tr>
                                    <tr><td className="py-3 px-4">Uploaded PDFs</td><td className="py-3 px-4">Syllabus upload</td><td className="py-3 px-4">Core product feature</td></tr>
                                    <tr><td className="py-3 px-4">Chat messages</td><td className="py-3 px-4">Using AI chat</td><td className="py-3 px-4">Providing AI responses</td></tr>
                                    <tr><td className="py-3 px-4">Payment info</td><td className="py-3 px-4">Upgrading to Pro</td><td className="py-3 px-4">Processed by Stripe — we never see full card details</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-lg font-bold text-white pt-6">2b. Data Collected Automatically</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Data</th>
                                        <th className="py-3 px-4 font-semibold">Why</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Page views and navigation</td><td className="py-3 px-4">Analytics (Umami — no cookies, no personal data)</td></tr>
                                    <tr><td className="py-3 px-4">Device type and browser</td><td className="py-3 px-4">Technical optimization</td></tr>
                                    <tr><td className="py-3 px-4">Country/region</td><td className="py-3 px-4">Service optimization</td></tr>
                                    <tr><td className="py-3 px-4">Usage patterns</td><td className="py-3 px-4">Improving the product</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="font-bold text-white pt-4">What we do NOT collect:</p>
                        <ul className="list-none space-y-2 text-[#cbd5e1]">
                            <li><span className="text-red-400 mr-2">✕</span> No - Your real name (unless you provide it)</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Phone number</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Location beyond country level</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Social media profiles</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Browsing history outside Stavlos</li>
                        </ul>
                    </section>

                    <section id="how-we-use" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">3. How We Use Your Data</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li><strong>Provide the Service</strong> — process your uploads, generate AI responses, save your chat history</li>
                            <li><strong>Send transactional emails</strong> — account verification, password reset, subscription receipts (via Resend)</li>
                            <li><strong>Process payments</strong> — subscription billing via Stripe</li>
                            <li><strong>Improve the product</strong> — aggregate usage analytics to understand what features are used</li>
                            <li><strong>Communicate important updates</strong> — changes to Terms, pricing, or the Service</li>
                            <li><strong>Security</strong> — detect and prevent abuse, unauthorized access, and fraud</li>
                        </ul>

                        <p className="font-bold text-white pt-4">We do NOT use your data to:</p>
                        <ul className="list-none space-y-2 text-[#cbd5e1]">
                            <li><span className="text-red-400 mr-2">✕</span> No - Train AI models</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Sell to advertisers or data brokers</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Build advertising profiles</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Share with third parties beyond what&apos;s listed in Section 6</li>
                        </ul>
                    </section>

                    <section id="legal-basis" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">4. Legal Basis for Processing (GDPR)</h2>
                        <p>For EU users, we process your data under the following legal bases:</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Processing Activity</th>
                                        <th className="py-3 px-4 font-semibold">Legal Basis</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Account creation and login</td><td className="py-3 px-4">Contract performance</td></tr>
                                    <tr><td className="py-3 px-4">Providing AI chat and tools</td><td className="py-3 px-4">Contract performance</td></tr>
                                    <tr><td className="py-3 px-4">Processing payments</td><td className="py-3 px-4">Contract performance</td></tr>
                                    <tr><td className="py-3 px-4">Sending transactional emails</td><td className="py-3 px-4">Contract performance</td></tr>
                                    <tr><td className="py-3 px-4">Analytics (Umami)</td><td className="py-3 px-4">Legitimate interests</td></tr>
                                    <tr><td className="py-3 px-4">Security and fraud prevention</td><td className="py-3 px-4">Legitimate interests</td></tr>
                                    <tr><td className="py-3 px-4">Marketing emails (if opted in)</td><td className="py-3 px-4">Consent</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="data-storage" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">5. Data Storage and Security</h2>
                        <p><strong className="text-white">Where your data is stored:</strong></p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>Database: Supabase (PostgreSQL) — EU region (Frankfurt, Germany)</li>
                            <li>File storage: Supabase Storage — EU region</li>
                            <li>Cache: Upstash Redis — EU region</li>
                            <li>Emails: Resend — processed in the US, compliant with EU-US Data Privacy Framework</li>
                        </ul>
                        <p className="mt-4"><strong className="text-white">Security measures:</strong></p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>All data encrypted in transit (HTTPS/TLS)</li>
                            <li>Database encrypted at rest</li>
                            <li>Row Level Security (RLS) — you can only access your own data</li>
                            <li>No plain-text passwords — all authentication handled by Supabase Auth</li>
                            <li>Regular security reviews</li>
                        </ul>
                        <p className="mt-4"><strong className="text-white">Data breach notification:</strong><br />
                            In the event of a data breach affecting your personal data, we will notify you within 72 hours as required by GDPR.</p>
                    </section>

                    <section id="third-party" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">6. Third-Party Services</h2>
                        <p>We use the following third-party services. Each has their own privacy policy:</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Service</th>
                                        <th className="py-3 px-4 font-semibold">Purpose</th>
                                        <th className="py-3 px-4 font-semibold">Data Shared</th>
                                        <th className="py-3 px-4 font-semibold">Privacy Policy</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Supabase</td><td className="py-3 px-4">Database, auth</td><td className="py-3 px-4">Account data, files</td><td className="py-3 px-4 break-all"><a href="https://supabase.com/privacy" target="_blank" className="text-blue-400">supabase.com/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">Stripe</td><td className="py-3 px-4">Payment processing</td><td className="py-3 px-4">Email, subscription</td><td className="py-3 px-4 break-all"><a href="https://stripe.com/privacy" target="_blank" className="text-blue-400">stripe.com/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">Resend</td><td className="py-3 px-4">Transactional email</td><td className="py-3 px-4">Email address</td><td className="py-3 px-4 break-all"><a href="https://resend.com/privacy" target="_blank" className="text-blue-400">resend.com/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">Upstash</td><td className="py-3 px-4">Redis cache</td><td className="py-3 px-4">Cached AI responses</td><td className="py-3 px-4 break-all"><a href="https://upstash.com/trust/privacy" target="_blank" className="text-blue-400">upstash.com/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">Vercel</td><td className="py-3 px-4">Hosting</td><td className="py-3 px-4">IP address (logs)</td><td className="py-3 px-4 break-all"><a href="https://vercel.com/legal/privacy-policy" target="_blank" className="text-blue-400">vercel.com/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">Umami</td><td className="py-3 px-4">Analytics</td><td className="py-3 px-4">Page views (no PII)</td><td className="py-3 px-4 break-all"><a href="https://umami.is/privacy" target="_blank" className="text-blue-400">umami.is/privacy</a></td></tr>
                                    <tr><td className="py-3 px-4">OpenRouter</td><td className="py-3 px-4">AI responses</td><td className="py-3 px-4">Chat context*</td><td className="py-3 px-4 break-all"><a href="https://openrouter.ai/privacy" target="_blank" className="text-blue-400">openrouter.ai/privacy</a></td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-amber-500/[0.05] border border-amber-500/30 rounded-xl p-6 border-l-4 border-l-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)] my-6">
                            <p className="text-[#e2e8f0] leading-relaxed">
                                <strong className="text-white">Warning:</strong> When you send a message or upload a syllabus,
                                the content is sent to third-party AI providers to generate a response. Do not upload documents
                                containing sensitive personal information such as medical records, financial details, or government IDs.
                            </p>
                        </div>
                    </section>

                    <section id="ai-and-data" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">7. AI and Your Data</h2>
                        <p><strong className="text-white">What gets sent to AI providers:</strong><br />
                            When you use the AI chat or any tool, your message and relevant context (such as matching chunks from your uploaded syllabus) are sent to third-party AI model providers to generate a response.</p>

                        <p className="mt-4"><strong className="text-white">What we do NOT do:</strong></p>
                        <ul className="list-disc pl-5 space-y-2 text-[#cbd5e1]">
                            <li>We do not use your conversations or documents to train AI models</li>
                            <li>We do not permanently store your conversations with AI providers — they process and return the response</li>
                            <li>We select AI providers who commit to not training on API user data</li>
                        </ul>

                        <p className="mt-4"><strong className="text-white">Recommendation:</strong><br />
                            Do not upload documents containing sensitive personal information. Syllabi, lecture notes, and course materials are fine. Medical records, financial documents, and government IDs are not appropriate for this Service.</p>
                    </section>

                    <section id="rights-gdpr" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">8. Your Rights (GDPR)</h2>
                        <div className="bg-blue-500/[0.05] border border-blue-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] my-6">
                            <p className="text-[#e2e8f0] font-medium text-center">
                                If you are in the EU, you have the following rights under GDPR. We will respond to all requests within 30 days.
                            </p>
                        </div>
                        <p><strong>Your rights:</strong></p>
                        <ul className="space-y-4">
                            <li><strong className="text-white">Right to Access</strong> — Request a copy of all personal data we hold about you.</li>
                            <li><strong className="text-white">Right to Rectification</strong> — Request correction of inaccurate personal data.</li>
                            <li><strong className="text-white">Right to Erasure (&quot;Right to be Forgotten&quot;)</strong> — Request deletion of all your personal data. You can also do this yourself by deleting your account in settings.</li>
                            <li><strong className="text-white">Right to Data Portability</strong> — Request your data in a machine-readable format (JSON export).</li>
                            <li><strong className="text-white">Right to Restrict Processing</strong> — Request that we limit how we process your data.</li>
                            <li><strong className="text-white">Right to Object</strong> — Object to processing based on legitimate interests.</li>
                            <li><strong className="text-white">Right to Withdraw Consent</strong> — Where processing is based on consent, withdraw it at any time.</li>
                            <li><strong className="text-white">Right to Lodge a Complaint</strong> — You have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) at autoriteitpersoonsgegevens.nl.</li>
                        </ul>
                        <p className="mt-6"><strong className="text-white">How to exercise your rights:</strong><br />
                            Email hello@stavlos.com with the subject line <em>&quot;GDPR Request — [Right you are exercising]&quot;</em>. We will respond within 30 days.</p>
                    </section>

                    <section id="rights-usa" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">8b. Your Rights (USA — CCPA/CPRA)</h2>
                        <p>If you are a resident of California or another US state with applicable privacy laws, you have the following rights under the CCPA/CPRA:</p>
                        <ul className="space-y-4">
                            <li><strong className="text-white">Right to Know</strong> — Disclosure of the categories and specific pieces of personal information we have collected about you.</li>
                            <li><strong className="text-white">Right to Delete</strong> — Request deletion of personal information we have collected, subject to legal exceptions.</li>
                            <li><strong className="text-white">Right to Correct</strong> — Request correction of inaccurate personal information.</li>
                            <li><strong className="text-white">Right to Opt-Out of Sale or Sharing</strong> — Stavlos does not sell personal information and does not share it for cross-context behavioral advertising. You do not need to opt out, as no sale occurs.</li>
                            <li><strong className="text-white">Right to Limit Use of Sensitive Personal Information</strong> — We do not use sensitive personal information beyond what is necessary to provide the Service.</li>
                            <li><strong className="text-white">Right to Non-Discrimination</strong> — We will not discriminate against you for exercising any of your privacy rights.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-white pt-6">Categories of Personal Information Collected (CCPA)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Category</th>
                                        <th className="py-3 px-4 font-semibold">Examples</th>
                                        <th className="py-3 px-4 font-semibold">Collected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Identifiers</td><td className="py-3 px-4">Email address, account ID</td><td className="py-3 px-4">Yes</td></tr>
                                    <tr><td className="py-3 px-4">Personal records</td><td className="py-3 px-4">Name (if provided), school</td><td className="py-3 px-4">Yes</td></tr>
                                    <tr><td className="py-3 px-4">Internet activity</td><td className="py-3 px-4">Pages visited, features used</td><td className="py-3 px-4">Yes</td></tr>
                                    <tr><td className="py-3 px-4">Geolocation</td><td className="py-3 px-4">Country level only</td><td className="py-3 px-4">Yes</td></tr>
                                    <tr><td className="py-3 px-4">Inferences</td><td className="py-3 px-4">Usage patterns</td><td className="py-3 px-4">Yes</td></tr>
                                    <tr><td className="py-3 px-4">Financial information</td><td className="py-3 px-4">Payment processed by Stripe</td><td className="py-3 px-4">No</td></tr>
                                    <tr><td className="py-3 px-4">Sensitive personal information</td><td className="py-3 px-4">Government IDs, health data</td><td className="py-3 px-4">No</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-6"><strong className="text-white">How to Exercise US Privacy Rights</strong><br />
                            Email hello@stavlos.com with the subject line <em>&quot;US Privacy Request — [Right you are exercising]&quot;</em>. We will respond within 45 days. You may also designate an authorized agent to submit requests on your behalf.</p>
                    </section>

                    <section id="cookies" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">9. Cookies</h2>
                        <p className="font-bold text-white">The short version: we barely use cookies.</p>
                        <div className="overflow-x-auto my-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Cookie</th>
                                        <th className="py-3 px-4 font-semibold">Purpose</th>
                                        <th className="py-3 px-4 font-semibold">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Supabase auth token</td><td className="py-3 px-4">Keep you logged in</td><td className="py-3 px-4">Necessary</td></tr>
                                    <tr><td className="py-3 px-4">Theme preference</td><td className="py-3 px-4">Remember dark/light mode</td><td className="py-3 px-4">Functional</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="font-bold text-white mt-4">We do NOT use:</p>
                        <ul className="list-none space-y-2 text-[#cbd5e1]">
                            <li><span className="text-red-400 mr-2">✕</span> No - Advertising cookies</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Third-party tracking cookies</li>
                            <li><span className="text-red-400 mr-2">✕</span> No - Analytics cookies (Umami is cookieless)</li>
                        </ul>
                        <p className="mt-4">Because we only use necessary and functional cookies, we do not need a cookie consent banner under EU law.</p>
                    </section>

                    <section id="childrens-privacy" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">10. Children&apos;s Privacy</h2>
                        <p>Stavlos is not intended for children under 13. We do not knowingly collect personal data from children under 13.</p>
                        <p>For users aged 13-15 in the EU: under GDPR, users must be at least 16 to consent to data processing independently. Users aged 13-15 in the EU must have parental consent to use Stavlos. By creating an account, users in this age group confirm they have obtained parental consent.</p>
                        <p>If you believe a child under 13 has provided personal data, contact us at hello@stavlos.com and we will delete it promptly.</p>
                    </section>

                    <section id="data-retention" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">11. Data Retention</h2>
                        <div className="overflow-x-auto my-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-white">
                                        <th className="py-3 px-4 font-semibold">Data Type</th>
                                        <th className="py-3 px-4 font-semibold">Retention Period</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4">Account data</td><td className="py-3 px-4">Until account deletion + 30 days</td></tr>
                                    <tr><td className="py-3 px-4">Uploaded syllabi and files</td><td className="py-3 px-4">Until deleted by user or account deletion + 30 days</td></tr>
                                    <tr><td className="py-3 px-4">Chat history</td><td className="py-3 px-4">Until deleted by user or account deletion + 30 days</td></tr>
                                    <tr><td className="py-3 px-4">Payment records</td><td className="py-3 px-4">7 years (required by Dutch tax law)</td></tr>
                                    <tr><td className="py-3 px-4">Analytics data (Umami)</td><td className="py-3 px-4">24 months, aggregated only</td></tr>
                                    <tr><td className="py-3 px-4">Security logs</td><td className="py-3 px-4">90 days</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p>When you delete your account, all personal data is permanently deleted within 30 days, except payment records which must be retained for tax purposes.</p>
                    </section>

                    <section id="changes" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">12. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email and/or a prominent notice on the Service at least 14 days before changes take effect.</p>
                        <p>The &quot;Last updated&quot; date at the top of this page will always reflect the most recent version.</p>
                    </section>

                    <section id="contact" className="scroll-mt-32 space-y-4">
                        <h2 className="text-2xl font-syne font-bold text-white">13. Contact and Data Requests</h2>
                        <p>For privacy questions, data requests, or GDPR rights:</p>
                        <p className="text-white">
                            <strong>Email:</strong> <a href="mailto:hello@stavlos.com" className="text-blue-400">hello@stavlos.com</a><br />
                            <strong>Subject line for data requests:</strong> &quot;GDPR Request — [Your request]&quot;<br />
                            <strong>Response time:</strong> Within 30 days
                        </p>
                        <div className="mt-8 space-y-6">
                            <div>
                                <p className="text-white font-bold">Data Controller:</p>
                                <p>Abraham Alapayo<br />Amersfoort, Netherlands</p>
                            </div>
                            <div>
                                <p className="text-white font-bold">Supervisory Authority:</p>
                                <p>Autoriteit Persoonsgegevens (Dutch Data Protection Authority)<br />
                                    <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" className="text-blue-400">autoriteitpersoonsgegevens.nl</a></p>
                            </div>
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
