'use client'

import { useState } from 'react'
import { getBadge, calculatePrice } from '@/lib/referral'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Get referral code from URL
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const refCode = params?.get('ref') || ''

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          referredBy: refCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        setUserData(data.user)
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
      alert('Referral link copied!')
    }
  }

  // SUCCESS STATE - After signup
  if (userData) {
    const progress = Math.min((userData.referralCount / 2) * 100, 100)
    const finalPrice = calculatePrice(userData.rank, userData.referralCount)

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-5xl font-bold mb-4">YOU'RE IN!</h1>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
            {/* Position & Badge */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Your Position</p>
                  <p className="text-5xl font-bold">#{userData.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60 mb-1">Status</p>
                  <p className="text-2xl font-bold">{userData.badge.title}</p>
                </div>
              </div>
              <p className="text-white/80">{userData.badge.perks}</p>
            </div>

            {/* Referral Link */}
            <div className="mb-8 p-6 bg-black/40 rounded-xl">
              <p className="text-sm text-white/60 mb-2">Your Referral Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userData.referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold whitespace-nowrap"
                >
                  COPY
                </button>
              </div>
            </div>

            {/* Referral Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">📈 Unlock Rewards</h3>
                <span className="text-sm text-white/60">
                  {userData.referralCount}/2 friends
                </span>
              </div>
              <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-white/60">
                Invite 2 friends → <span className="text-green-400 font-semibold">10% off for 12 months</span>
              </p>
              {userData.referralCount >= 2 && (
                <p className="text-lg text-green-400 font-bold mt-2">
                  🎉 Discount unlocked! Your price: €{finalPrice.toFixed(2)}/mo
                </p>
              )}
            </div>

            {/* Leaderboard Preview */}
            <div className="p-6 bg-black/40 rounded-xl">
              <h3 className="text-xl font-bold mb-4">🏆 Leaderboard</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">1. ja***@gmail.com</span>
                  <span className="font-semibold">47 referrals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">2. ab***@outlook.com</span>
                  <span className="font-semibold">32 referrals</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span className="font-semibold">YOU</span>
                  <span className="font-semibold">{userData.referralCount} referrals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-white/40 text-sm mt-8">
            Check your email for details. Launch: September 2025
          </p>
        </div>
      </div>
    )
  }

  // INITIAL STATE - Before signup
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-3xl w-full text-center">
          {/* Logo */}
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            STAVLOS
          </h1>

          {/* Tagline */}
          <h2 className="text-4xl font-bold mb-6">
            Stop Staring. Start Mastering.
          </h2>

          {/* Description */}
          <p className="text-xl text-white/60 mb-4">
            AI study partner built by a student, for students. €8/mo.
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold text-lg disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>

          {/* Social Proof */}
          <p className="text-white/40 mb-12">
            Join <span className="font-semibold text-white">12,847</span> students waiting
          </p>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl mb-3">⭐</div>
              <p className="text-sm font-semibold mb-1">Top 100</p>
              <p className="text-xs text-white/60">€5/mo forever</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl mb-3">🐦</div>
              <p className="text-sm font-semibold mb-1">Top 2,000</p>
              <p className="text-xs text-white/60">€5/mo (12 months)</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl mb-3">🎁</div>
              <p className="text-sm font-semibold mb-1">2+ Referrals</p>
              <p className="text-xs text-white/60">Extra 10% off</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full py-6 px-6 border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-white/40">
          <p>Built by Abraham, 14</p>
          <p>Launch: September 2025</p>
        </div>
      </footer>
    </div>
  )
}
