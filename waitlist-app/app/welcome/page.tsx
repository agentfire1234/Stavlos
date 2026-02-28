'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Copy, Share2, Trophy, Clock, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculatePrice, getBadge } from '@/lib/referral'
import Link from 'next/link'

function WelcomeContent() {
    const searchParams = useSearchParams()
    const email = searchParams?.get('email')
    const code = searchParams?.get('code') || searchParams?.get('ref')

    const [userData, setUserData] = useState<any>(null)
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!email) {
            setIsLoading(false)
            return
        }

        async function fetchData() {
            try {
                const queryParam = code ? `code=${encodeURIComponent(code)}` : `email=${encodeURIComponent(email || '')}`
                const res = await fetch(`/api/user?${queryParam}`)
                const data = await res.json()
                if (res.ok) {
                    setUserData(data.user)
                    setLeaderboard(data.leaderboard || [])

                    // Trigger Confetti
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#0066FF', '#00C853', '#FFFFFF']
                    })
                }
            } catch (e) {
                console.error('Failed to fetch user data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [email])

    const copyLink = () => {
        if (userData?.referralLink) {
            navigator.clipboard.writeText(userData.referralLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-blue)]"></div>
        </div>
    )

    if (!userData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] p-6 text-center">
            <Logo size={48} className="mb-8" />
            <h1 className="text-3xl font-bold mb-4 tracking-tight uppercase italic">Waitlist Entry Not Found</h1>
            <p className="text-[var(--text-muted)] mb-8">It seems we couldn't find your entry. Did you join through the main page?</p>
            <Link href="/" passHref legacyBehavior>
                <Button>Back to Home</Button>
            </Link>
        </div>
    )

    const progress = Math.min((userData.referralCount / 2) * 100, 100)
    const priceData = calculatePrice(userData.rank, userData.referralCount)
    const badgeInfo = getBadge(userData.rank)

    const shareText = `I just joined Stavlos - an AI that reads your syllabus so you never have to search PDFs at 2am again.\n\nFirst 2,000 get it for €5/month forever. I'm #${userData.rank} in line.\n\nJoin with my link to lock in the €5 price or get a free month:\n${userData.referralLink}`

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--headline)]">
            {/* Mini Nav */}
            <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="font-black tracking-tighter uppercase italic text-xl">Stavlos</span>
                </div>
                <Badge variant="primary">#{userData.rank} in line</Badge>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Header Section */}
                <section className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--success-green)]/10 border border-[var(--success-green)]/20 mb-4 animate-bounce">
                        <Check className="w-12 h-12 text-[var(--success-green)]" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">You&apos;re In!</h1>
                    <p className="text-xl text-[var(--text-muted)] font-medium">Welcome to the Stavlos founding members</p>
                </section>

                {/* Main Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tier Card */}
                    <div className="card-premium p-8 relative overflow-hidden group border-[var(--primary-blue)]/30">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--primary-blue)]/10 rounded-full blur-3xl" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4">Current Status</p>
                        <h2 className="text-3xl font-black italic mb-6 uppercase tracking-tighter">{badgeInfo.title}</h2>
                        <div className="p-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border)]">
                            <p className="text-xs font-bold mb-1 opacity-60">Locked Price</p>
                            <p className="text-4xl font-black tracking-tighter">€{priceData.finalPrice.toFixed(2)}<span className="text-sm font-bold opacity-30 ml-1">/mo</span></p>
                        </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="card-premium p-8 h-full flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Referral Progress</h3>
                            <span className="text-xs font-bold px-3 py-1 bg-[var(--success-green)]/10 text-[var(--success-green)] rounded-full">
                                {userData.referralCount} Joined
                            </span>
                        </div>
                        <div className="h-4 bg-[var(--bg-section)] rounded-full border border-[var(--border)] overflow-hidden mb-6">
                            <div
                                className="h-full bg-[var(--primary-blue)] transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                            {userData.referralCount >= 2
                                ? "1st Month Free & €5 Price Locked!"
                                : userData.referralCount === 1
                                    ? "€5 Price Locked! Refer 1 more friend to get your first month free."
                                    : "Refer 1 friend to lock in your €5/mo price forever."}
                        </p>
                    </div>
                </div>

                {/* Referral Referral Hub */}
                <section className="card-premium p-10 bg-[var(--bg-section)] relative overflow-hidden">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">Spread the word</h3>
                        <p className="text-[var(--text-muted)] mb-8">Copy your unique link or use the quick share buttons below.</p>

                        <div className="flex gap-2 p-2 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] mb-8">
                            <input
                                readOnly
                                value={userData.referralLink}
                                className="flex-1 bg-transparent px-4 font-mono text-sm text-[var(--text-muted)] focus:outline-none"
                            />
                            <Button onClick={copyLink} size="sm" className="h-10 px-6">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="secondary" className="h-12 w-full gap-2 p-0"
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}>
                                WhatsApp
                            </Button>
                            <Button variant="secondary" className="h-12 w-full gap-2 p-0"
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}>
                                Twitter (X)
                            </Button>
                            <Button variant="secondary" className="h-12 w-full gap-2 p-0"
                                onClick={() => window.open(`mailto:?subject=Join Stavlos Waitlist&body=${encodeURIComponent(shareText)}`, '_blank')}>
                                Email
                            </Button>
                            <Button variant="secondary" className="h-12 w-full gap-2 p-0"
                                onClick={copyLink}>
                                Share link
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Leaderboard Card */}
                <section className="card-premium p-10">
                    <div className="flex items-center gap-3 mb-10">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Waitlist Leaderboard</h3>
                    </div>

                    <div className="space-y-4">
                        {leaderboard.map((user, index) => {
                            const isMe = user.email === email
                            return (
                                <div key={index} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isMe ? 'border-[var(--primary-blue)] bg-[var(--primary-blue)]/5 scale-[1.02]' : 'border-[var(--border)] bg-[var(--bg-section)]/30'}`}>
                                    <div className="flex items-center gap-6">
                                        <span className={`text-2xl font-black italic ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'opacity-20'}`}>
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className="font-bold text-lg">{user.email.split('@')[0].substring(0, 3)}***</p>
                                            <p className="text-[10px] font-black uppercase opacity-40">Position: #{user.rank || (index + 1)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[var(--primary-blue)]">{user.referral_count} referrals</p>
                                        {index === 0 && <Badge variant="primary" className="mt-1">Rank #1</Badge>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <p className="mt-8 text-center text-xs text-[var(--text-muted)] font-medium">
                        Top 10 referrers get <span className="text-[var(--headline)]">lifetime free access</span> + founding member perks.
                    </p>
                </section>

                {/* Timeline visualization */}
                <section className="py-12 border-t border-[var(--border)] text-center">
                    <h3 className="text-xl font-bold mb-8 italic uppercase tracking-tight">Your Path to Launch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        <TimelineStep icon={<Clock />} date="NOW" label="You're on the list" active />
                        <TimelineStep icon={<ArrowRight />} date="MAY" label="Early Beta Access" />
                        <TimelineStep icon={<Clock />} date="JUN" label="Launch Day" />
                        <TimelineStep icon={<Check />} date="JUN+" label="Price Locked" />
                    </div>
                </section>
            </main>

            <footer className="p-12 text-center text-xs text-[var(--text-muted)] font-medium opacity-60">
                <p className="mb-4">Check your email for confirmation. We'll keep you updated on our progress.</p>
                <Logo size={20} className="mx-auto grayscale" />
            </footer>
        </div>
    )
}

function TimelineStep({ icon, date, label, active = false }: { icon: React.ReactNode, date: string, label: string, active?: boolean }) {
    return (
        <div className={`flex flex-col items-center gap-3 ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${active ? 'border-[var(--primary-blue)] bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]' : 'border-[var(--border)]'}`}>
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black tracking-widest uppercase">{date}</p>
                <p className="text-xs font-bold">{label}</p>
            </div>
        </div>
    )
}

export default function WelcomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WelcomeContent />
        </Suspense>
    )
}
