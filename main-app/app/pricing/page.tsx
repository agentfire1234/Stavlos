import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Check, ArrowRight, Zap, Target } from 'lucide-react'

export default async function PricingPage() {
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

    // Fetch Rank & Referrals for Dynamic Pricing Display
    const { data: waitlist } = await supabase
        .from('waitlist_with_rank')
        .select('current_rank, referral_count')
        .eq('email', user?.email || '')
        .single()

    const rank = waitlist?.current_rank || 10000
    const refs = waitlist?.referral_count || 0

    // Pricing Logic (Waitlist Promises)
    const isPriceLocked = rank <= 2000 || refs >= 1
    const hasFreeTrial = refs >= 2

    const basePrice = 8
    const finalPrice = isPriceLocked ? 5 : 8

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-16 py-12">

                <header className="text-center space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter italic">Stavlos Pro</h1>
                    <p className="text-white/40 font-medium max-w-lg mx-auto">
                        Unlock the full power of the AI Student OS. One price, unlimited mastery.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Features List */}
                    <div className="space-y-8">
                        <Feature icon={Zap} title="Unlimited AI Study Sessions" desc="No daily message limits on Llama 3.1 70B." />
                        <Feature icon={Target} title="Priority Course Indexing" desc="Get your syllabuses processed instantly." />
                        <Feature icon={Check} title="Founding Member Badge" desc="Exclusive status in the global leaderboard." />
                        <Feature icon={Check} title="Mobile PWA Access" desc="Install Stavlos on your phone for on-the-go study." />
                    </div>

                    {/* Price Card */}
                    <div className="glass-card p-12 border-blue-500/20 bg-blue-500/[0.02] relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />

                        <div className="relative z-10 space-y-8 text-center">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">
                                    {isPriceLocked ? 'Founding Member Price Locked' : 'Early Bird Claim'}
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-3xl font-black text-white/30 mt-4">€</span>
                                    <span className="text-8xl font-black tracking-tighter">{finalPrice}</span>
                                    <span className="text-lg font-bold text-white/20 ml-2">/mo</span>
                                </div>
                                {hasFreeTrial && (
                                    <p className="text-blue-400 text-[10px] font-black uppercase mt-2">
                                        + 1st Month Free Unlocked
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <span>Waitlist Rank #{rank}</span>
                                    <span>{isPriceLocked ? '€5 Locked' : '€8 Standard'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    <span>Referral Quest</span>
                                    <span>
                                        {refs === 0 ? '0 refs' : refs === 1 ? '1 ref: Price Locked' : `${refs} refs: Free Month`}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group/btn">
                                Upgrade to Pro <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-[10px] font-bold text-white/20 italic">
                                * Pricing locked in as a Founding Member
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Feature({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-sm uppercase tracking-tight">{title}</h3>
                <p className="text-xs text-white/40 font-medium">{desc}</p>
            </div>
        </div>
    )
}
