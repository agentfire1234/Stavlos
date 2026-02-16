import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Trophy, Medal, User, Crown, ArrowLeft } from 'lucide-react'

export default async function LeaderboardPage() {
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

    // Fetch Top 50 by Referral Count (Competitive Leaderboard)
    const { data: leaders } = await supabase
        .from('waitlist')
        .select('id, full_name, referral_count, created_at')
        .order('referral_count', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(50)

    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-2 italic">Hall of Fame</h1>
                            <p className="text-white/40 font-medium">The top students driving the Stavlos revolution.</p>
                        </div>
                        <Trophy className="w-12 h-12 text-yellow-500/20" />
                    </div>
                </header>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {leaders?.slice(0, 3).map((leader, index) => (
                        <div
                            key={leader.id}
                            className={`
                                relative p-8 glass-card flex flex-col items-center text-center gap-4
                                ${index === 0 ? 'border-yellow-500/20 bg-yellow-500/5' : ''}
                                ${index === 1 ? 'border-slate-300/20 bg-slate-300/5' : ''}
                                ${index === 2 ? 'border-orange-500/20 bg-orange-500/5' : ''}
                            `}
                        >
                            <div className="absolute top-4 left-4 text-xs font-black text-white/20 uppercase tracking-[0.2em]">
                                Rank #{index + 1}
                            </div>
                            <div className={`
                                w-20 h-20 rounded-full flex items-center justify-center border-2
                                ${index === 0 ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : ''}
                                ${index === 1 ? 'border-slate-300 text-slate-300 bg-slate-300/10' : ''}
                                ${index === 2 ? 'border-orange-500 text-orange-500 bg-orange-500/10' : ''}
                            `}>
                                {index === 0 ? <Crown className="w-10 h-10" /> : <User className="w-10 h-10" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{leader.full_name || 'Anonymous'}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">
                                    {leader.referral_count} Referrals
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* List View */}
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
                                <th className="p-6 pl-8">#</th>
                                <th className="p-6">Student</th>
                                <th className="p-6 text-right pr-12">Impact</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {leaders?.slice(3).map((leader, index) => (
                                <tr key={leader.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 pl-8 font-black text-white/20">{(index + 4).toString().padStart(2, '0')}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                                {leader.full_name?.substring(0, 1) || 'S'}
                                            </div>
                                            <span className="font-bold">{leader.full_name || 'Anonymous Student'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right pr-12">
                                        <span className="bg-white/5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border border-white/10">
                                            {leader.referral_count} refs
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-center pb-12">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                        Stavlos OS Global Rankings • Verified Students Only
                    </p>
                </div>
            </div>
        </div>
    )
}
