'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBadge, calculatePrice } from '@/lib/referral'
import {
  Zap,
  Calculator,
  Edit3,
  ArrowRight,
  Check,
  ShieldCheck,
  Users,
  ChevronRight,
  Copy,
  Trophy
} from 'lucide-react'
import { Logo } from '@/components/logo'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [totalSignups, setTotalSignups] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  // 1. Fetch Stats & Leaderboard (Real Data Policy)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        setTotalSignups(data.total)
        setLeaderboard(data.leaderboard || [])
      } catch (e) {
        console.error('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  // BUG 011 FIX: Never access window at render time in Next.js — it breaks SSR.
  // Instead, read the referral code inside useEffect so it only runs client-side.
  const [refCode, setRefCode] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // BUG 009 FIX: Trim hidden spaces or %20 from referral code in URL
    setRefCode(params.get('ref')?.trim().replace(/%20/g, '') || '')
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    // BUG 006 FIX: Guard against double-submit — early return if already loading
    if (loading) return
    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // BUG 007 FIX: Normalize email to lowercase before sending
        body: JSON.stringify({ email: email.trim().toLowerCase(), referredBy: refCode })
      })

      const data = await response.json()
      if (response.ok) {
        setUserData(data.user)
        // Refresh stats to include the new user
        const statsRes = await fetch('/api/stats')
        const statsData = await statsRes.json()
        setTotalSignups(statsData.total)
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      alert('Failed to join waitlist')
    } finally {
      setLoading(false)
    }
  }

  function copyReferralLink() {
    if (userData?.referralLink) {
      navigator.clipboard.writeText(userData.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function obfuscateEmail(email: string) {
    if (!email) return ''
    const [name, domain] = email.split('@')
    const visible = name.substring(0, 2)
    return `${visible}***@${domain}`
  }

  // SUCCESS STATE
  if (userData) {
    const progress = Math.min((userData.referralCount / 2) * 100, 100)
    const finalPrice = calculatePrice(userData.rank, userData.referralCount)
    const badgeInfo = getBadge(userData.rank)

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="max-w-2xl w-full space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-4 h-bounce">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">You're In! 🎉</h1>
            <p className="text-white/40 font-medium">Founding status: {badgeInfo.title}</p>
          </div>

          {/* Rank Card */}
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Live Position</p>
                <p className="text-7xl font-black tracking-tighter">#{userData.rank}</p>
              </div>
              <div className="px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                {badgeInfo.title.split(' ')[0]} 🐦
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">Your Perks</p>
                {[badgeInfo.perks, 'Early Beta Access', 'Founding Badge'].map(perk => (
                  <li key={perk} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-xs font-bold mb-2">Target Price</p>
                <p className="text-3xl font-black tracking-tighter">€{finalPrice.toFixed(2)}<span className="text-sm font-bold text-white/20 ml-1">/mo</span></p>
              </div>
            </div>
          </div>

          {/* Referral Card */}
          <div className="glass-card p-10 space-y-8">
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase italic mb-2">🎁 Unlock 10% Extra Discount</h3>
              <p className="text-sm text-white/40">Refer 2 friends to Stavlos and lock in a 10% lifetime discount.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/20">Progress</span>
                <span className={`${userData.referralCount >= 2 ? 'text-green-500' : 'text-blue-400'}`}>
                  {userData.referralCount}/2 Friends
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                readOnly
                value={userData.referralLink}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white/40 focus:outline-none"
              />
              <button
                onClick={copyReferralLink}
                className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-tight hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div className="glass-card p-10">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Global Top Referrers</h3>
            </div>
            <div className="space-y-4">
              {leaderboard.slice(0, 3).map((u, i) => (
                <div key={i} className={`flex justify-between items-center p-4 rounded-xl border ${u.email === userData.email ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-white/10">#{i + 1}</span>
                    <span className="font-mono text-xs">{obfuscateEmail(u.email)}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{u.referral_count} referrals</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // INITIAL STATE
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-blue-500">
      {/* Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

      <nav className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={26} className="text-teal-400" href="/" />
          <div className="text-2xl font-black tracking-tighter uppercase italic">Stavlos</div>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
          <a href="/leaderboard" className="hover:text-white transition-colors">Global Rank</a>
          <a href="https://x.com/TheStavlos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X / Updates</a>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              {totalSignups?.toLocaleString() || '12,000+'} students waiting
            </span>
          </div>

          {/* BUG 005 FIX: Use clamp() so the hero text is fluid and never causes
              horizontal scroll on small screens like iPhone SE. */}
          <h1 className="font-black tracking-tighter italic leading-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 9rem)' }}>
            STOP STARING.<br />
            <span className="bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent italic">START MASTERING.</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
            The AI study partner built by a student, for students.<br />
            <span className="text-white/20 mt-2 block">€8/mo · No BS · Highly Lethal</span>
          </p>

          <div className="max-w-md mx-auto pt-8">
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@uni.com"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-50 transition-all shadow-glow active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Claim Spot'}
              </button>
            </form>
            <p className="mt-6 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
              Top 2,000 get <span className="text-white/40">€5/mo forever</span> • Free to join
            </p>
          </div>
        </div>
      </main>

      {/* Features Row */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-12">
          <Feature
            icon={<Zap className="w-8 h-8" />}
            title="Syllabus Awareness"
            desc="Upload your syllabus. Ask 'When is my test?' or 'Explain Week 4'."
          />
          <Feature
            icon={<Calculator className="w-8 h-8" />}
            title="Math Logic"
            desc="Neural-step reasoning for complex equations. Not just answers."
          />
          <Feature
            icon={<Edit3 className="w-8 h-8" />}
            title="Pro Grade Essays"
            desc="PEEL structure, grammar logic, and source-checked drafts."
          />
        </div>
      </section>

      <footer className="relative z-10 px-8 py-16 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size={20} className="text-teal-400" />
              <span className="font-black tracking-tighter uppercase italic text-lg">Stavlos</span>
            </div>
            <p className="text-white/40 leading-relaxed">
              The AI study partner built by a student, for students.
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
              © 2026 Stavlos OS
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Product</h4>
            <ul className="space-y-2 text-white/40">
              <li className="hover:text-white transition-colors cursor-pointer">Syllabus Awareness</li>
              <li className="hover:text-white transition-colors cursor-pointer">Math Logic</li>
              <li className="hover:text-white transition-colors cursor-pointer">Essay Writing</li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Legal</h4>
            <ul className="space-y-2 text-white/40">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Admin / More Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">More</h4>
            <ul className="space-y-2 text-white/40">
              <li><a href="https://x.com/TheStavlos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter (X)</a></li>
              <li><a href="mailto:hello@stavlos.com" className="hover:text-white transition-colors">Contact</a></li>
              {/* Hidden Admin Link for Owner */}
              <li><Link href="/admin" className="hover:text-white transition-colors opacity-10 hover:opacity-100">Admin Login</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="space-y-6 group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-blue-500 transition-colors duration-500">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black tracking-tight italic uppercase">{title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
