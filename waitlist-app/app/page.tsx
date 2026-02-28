'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/hero'
import { ProblemSection } from '@/components/problem-section'
import { supabase } from '@/lib/supabase'
import { SolutionSection } from '@/components/solution-section'
import { ComparisonSection } from '@/components/comparison-section'
import { WhatIncludedSection } from '@/components/what-included-section'
import { FoundingStatusSection } from '@/components/founding-status-section'
import { ReferralBonusSection } from '@/components/referral-bonus-section'
import { FounderStorySection } from '@/components/founder-story-section'
import { FAQSection } from '@/components/faq-section'
import { FinalCTASection } from '@/components/final-cta-section'
import { StickyCTA } from '@/components/sticky-cta'
import { Navbar } from '@/components/navbar'
import { Logo } from '@/components/logo'
import Link from 'next/link'

export default function WaitlistPage() {
  const router = useRouter()
  const [totalSignups, setTotalSignups] = useState<number | null>(null)
  const [refCode, setRefCode] = useState('')

  // 1. Fetch Stats (Real Data Policy)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        setTotalSignups(data.total)
      } catch (e) {
        console.error('Failed to fetch stats')
      }
    }
    fetchStats()

    // 1b. REALTIME: Listen for new signups live
    const channel = supabase
      .channel('realtime_signups')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'waitlist' },
        () => {
          // Increment locally for instant "wow" factor
          setTotalSignups(prev => (prev === null ? 1 : prev + 1))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 2. Extract Referral Code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRefCode(params.get('ref')?.trim().replace(/%20/g, '') || '')
  }, [])

  // 3. Centralized Signup Handler
  const handleSignup = async (email: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), referredBy: refCode })
      })

      const data = await response.json()
      if (response.ok) {
        // Redirect to specialized /welcome hub
        router.push(`/welcome?code=${encodeURIComponent(data.user.referralCode)}`)
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      alert('Failed to join waitlist')
    }
  }

  const spotsLeft = totalSignups === null ? 2000 : Math.max(0, 2000 - totalSignups)
  const studentsJoined = totalSignups || 0

  return (
    <div className="min-h-screen">
      <StickyCTA />
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-0 space-y-0">

        <Hero
          spotsLeft={spotsLeft}
          studentsJoined={studentsJoined}
          onSignup={handleSignup}
        />
        <ProblemSection />
        <div id="how">
          <SolutionSection />
        </div>
        <div id="pricing">
          <ComparisonSection />
          <WhatIncludedSection />
        </div>
        <ReferralBonusSection />
        <FounderStorySection />
        <div id="faq">
          <FAQSection />
        </div>
        <FinalCTASection
          studentsJoined={studentsJoined}
          onSignup={handleSignup}
        />
      </main>

      {/* Modern Footer Implementation */}
      <footer className="px-8 py-20 border-t border-[var(--border)] bg-[var(--bg-section)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4 col-span-1 md:col-span-1">
              <div className="flex items-center gap-2">
                <Logo size={24} />
                <span className="font-black tracking-tighter uppercase italic text-xl">Stavlos</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                Study smarter, not harder. The AI study partner built by a student, for students (who really wants a gaming PC).
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-widest uppercase">Product</h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li><a href="#how" className="hover:text-[var(--primary-blue)] transition-colors">How it Works</a></li>
                <li><a href="#pricing" className="hover:text-[var(--primary-blue)] transition-colors">Pricing</a></li>
                <li><a href="/leaderboard" className="hover:text-[var(--primary-blue)] transition-colors">Leaderboard</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-widest uppercase">Legal</h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors opacity-20 hover:opacity-100">Admin</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-widest uppercase">Connect</h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li><a href="https://x.com/TheStavlos" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary-blue)] transition-colors">Twitter (X)</a></li>
                <li><a href="mailto:hello@stavlos.com" className="hover:text-[var(--primary-blue)] transition-colors">Contact Abraham</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              © 2026 Stavlos. Built by a 14-year-old student.
            </p>
            <div className="flex gap-6 uppercase text-[10px] font-black tracking-[0.2em] text-[var(--text-muted)]">
              <span>Amersfoort</span>
              <span>Built in Public</span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
