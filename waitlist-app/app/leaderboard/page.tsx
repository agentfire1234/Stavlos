'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Search, ArrowRight, User, Award, Crown } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function LeaderboardPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchLoading, setSearchLoading] = useState(false)

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch('/api/leaderboard')
                const data = await res.json()
                if (res.ok) {
                    setLeaderboard(data.leaderboard || [])
                }
            } catch (e) {
                console.error('Failed to fetch leaderboard')
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setSearchLoading(true)
        router.push(`/welcome?email=${encodeURIComponent(email.trim().toLowerCase())}`)
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--headline)]">
            {/* Header / Nav */}
            <nav className="p-6 border-b border-[var(--border)] backdrop-blur-md bg-[var(--bg-main)]/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo size={32} />
                        <span className="text-2xl font-black tracking-tighter uppercase italic">Stavlos</span>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                            Back to Home <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
                {/* Hero / Search Section */}
                <section className="text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--primary-blue)]/10 border border-[var(--primary-blue)]/20 mb-4 rotate-3">
                        <Trophy className="w-10 h-10 text-[var(--primary-blue)]" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                        Waitlist<br /><span className="text-[var(--primary-blue)]">Leaderboard</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto font-medium">
                        The top 10 referrers get <span className="text-[var(--headline)]">lifetime free access</span>.
                        Enter your email below to check your specific rank.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col md:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 bg-[var(--bg-section)] border-[var(--border)] rounded-2xl text-lg px-6"
                            required
                        />
                        <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold italic uppercase tracking-tight gap-2" isLoading={searchLoading}>
                            Check Rank <Search className="w-5 h-5" />
                        </Button>
                    </form>
                </section>

                {/* Leaderboard Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Global Rankings</h2>
                        <Badge variant="outline" className="opacity-50">Live Updates</Badge>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-24 w-full bg-[var(--bg-section)] animate-pulse rounded-3xl border border-[var(--border)]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={index}
                                    className={`group relative overflow-hidden p-6 rounded-3xl border transition-all hover:scale-[1.01] flex items-center justify-between ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' :
                                        index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/30' :
                                            index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/30' :
                                                'bg-[var(--bg-section)] border-[var(--border)]'
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            {index === 0 ? <Crown className="w-8 h-8 text-yellow-500" /> :
                                                <span className={`text-2xl font-black italic ${index === 1 ? 'text-gray-400' :
                                                    index === 2 ? 'text-amber-600' :
                                                        'opacity-20'
                                                    }`}>#{index + 1}</span>}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-lg">{user.email.split('@')[0].substring(0, 3)}***</p>
                                                {index < 3 && <Badge className={
                                                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                                            'bg-amber-600/20 text-amber-600'
                                                }>Tier {3 - index}</Badge>}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-1">
                                                <User className="w-3 h-3" /> Founding Student
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <p className="text-xl font-black text-[var(--primary-blue)] tracking-tighter italic uppercase">{user.referral_count} Referrals</p>
                                        <p className="text-[10px] font-bold uppercase opacity-30">Status: Locked €5/mo</p>
                                    </div>
                                </div>
                            ))}

                            {leaderboard.length === 0 && !loading && (
                                <div className="p-20 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
                                    <p className="text-[var(--text-muted)] font-medium italic">No referrers yet. Be the first!</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Prize Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PrizeCard
                        icon={<Crown className="text-yellow-500" />}
                        title="Top 1"
                        desc="Lifetime Pro Access + Beta Key #1"
                    />
                    <PrizeCard
                        icon={<Trophy className="text-gray-400" />}
                        title="Top 3"
                        desc="Free Launch Year + Discord Role"
                    />
                    <PrizeCard
                        icon={<Award className="text-amber-600" />}
                        title="Top 10"
                        desc="Founding Medal + Prize Locked €5"
                    />
                </section>
            </main>

            <footer className="p-12 text-center text-xs text-[var(--text-muted)] font-medium border-t border-[var(--border)]">
                <p>© 2026 Stavlos. Rankings refresh every 60 seconds.</p>
            </footer>
        </div>
    )
}

function PrizeCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-3xl bg-[var(--bg-section)] border border-[var(--border)] flex flex-col items-center text-center gap-4 hover:border-[var(--primary-blue)]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="font-black italic uppercase tracking-tighter">{title}</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
