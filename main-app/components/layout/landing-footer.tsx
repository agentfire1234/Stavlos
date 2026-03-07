import Link from 'next/link'
import { Logo } from '@/components/logo'

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
    return (
        <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#475569] font-semibold">{title}</p>
            <ul className="space-y-2">
                {links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">{label}</Link></li>
                ))}
            </ul>
        </div>
    )
}

export function LandingFooter() {
    return (
        <footer className="border-t border-white/[0.06] py-16 px-5 w-full bg-[#0a0a0f]">
            <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                <div className="col-span-2 md:col-span-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <Logo size={20} className="text-blue-500" />
                        <span className="text-lg font-bold font-syne tracking-tight"><span className="text-blue-500">S</span>TAVLOS</span>
                    </div>
                    <p className="text-sm text-[#94a3b8] leading-relaxed">Study smarter, not harder. The AI study tool built by a student, for students.</p>
                </div>
                <FooterCol title="Product" links={[['Dashboard', '/dashboard'], ['How It Works', '/#features'], ['Pricing', '/#pricing'], ['Tools', '/tools'], ['FAQ', '/#faq']]} />
                <FooterCol title="Legal" links={[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']]} />
                <FooterCol title="Connect" links={[['Twitter / X', 'https://x.com/TheStavlos'], ['hello@stavlos.com', 'mailto:hello@stavlos.com']]} />
            </div>
            <div className="max-w-[1100px] mx-auto mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-[#475569]">© 2026 Stavlos. Built by a student, for students.</p>
                <p className="text-xs text-[#475569]">Amersfoort · Built in Public · v1.2.0</p>
            </div>
        </footer>
    )
}
