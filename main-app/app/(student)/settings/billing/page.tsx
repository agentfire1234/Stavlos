import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { CreditCard, ExternalLink, Zap, Shield, ArrowLeft, ArrowRight } from 'lucide-react'

export default async function BillingSettingsPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch profile to see tier
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    const isPro = profile?.is_pro || false

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-2xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight italic">Settings</h1>
                </header>

                <div className="flex gap-12 flex-col md:flex-row">
                    {/* Sidebar Nav */}
                    <nav className="w-full md:w-48 space-y-2">
                        <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-all">
                            <Shield className="w-4 h-4" /> Profile
                        </Link>
                        <Link href="/settings/billing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-white/10 text-white transition-all">
                            <CreditCard className="w-4 h-4" /> Billing
                        </Link>
                        <Link href="/settings/preferences" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-all">
                            <Zap className="w-4 h-4" /> Preferences
                        </Link>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 space-y-10">
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Current Plan</h2>

                            <div className={`p-8 rounded-[2rem] border overflow-hidden relative ${isPro ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">
                                            {isPro ? 'Stavlos Pro' : 'Free Tier'}
                                        </h3>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                            {isPro ? 'Full power unlocked' : 'Daily limit active'}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPro ? 'bg-blue-500 text-black' : 'bg-white/5 text-white/20'}`}>
                                        <Zap className="w-6 h-6 fill-current" />
                                    </div>
                                </div>

                                {isPro ? (
                                    <div className="mt-8">
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                                            Manage subscription on Stripe <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-8">
                                        <Link href="/pricing" className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all inline-flex items-center gap-2">
                                            Upgrade Now <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-6 pt-6 border-t border-white/5">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Payment Methods</h2>
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-6 bg-white/10 rounded border border-white/5" />
                                    <p className="text-xs font-bold text-white/40">No payment method on file</p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                                    Add →
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
