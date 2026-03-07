'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Upload,
  MessageSquare,
  Sparkles,
  Calculator,
  FileText,
  CheckSquare,
  PenTool,
  BookMarked,
  Layers,
  BookOpen,
  Pin,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { LandingNav } from '@/components/layout/landing-nav'
import { LandingFooter } from '@/components/layout/landing-footer'

/* ─────────────────── ANIMATIONS ─────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 }
  })
}
const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

/* ─────────────── CYCLING Q&A DATA ─────────────── */
const QA_EXAMPLES = [
  {
    q: 'When is the midterm?',
    a: 'Your midterm is October 15th from 2–4 PM in Room 204, Building C.',
    src: 'Week 7 exam schedule, page 3'
  },
  {
    q: "What's the grading breakdown?",
    a: 'Midterm 30% · Final Exam 40% · Weekly Assignments 20% · Participation 10%',
    src: 'Assessment criteria, page 1'
  },
  {
    q: 'How many absences am I allowed?',
    a: "You're allowed up to 3 absences. A 4th absence results in a full letter grade deduction.",
    src: 'Attendance and participation policy, page 2'
  },
]

/* ═══════════════════════════════════════════════════ */
/*                    LANDING PAGE                     */
/* ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for active nav link
  useEffect(() => {
    const ids = ['features', 'tools', 'pricing', 'faq']
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div className="bg-[#0a0a0f] text-white overflow-x-hidden -ml-0 md:-ml-60">

      {/* ── S1: NAVIGATION ── */}
      <LandingNav />

      {/* ── S2: HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-5 text-center">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.22) 0%, transparent 55%)' }} />

        <div className="relative z-10 max-w-[700px] mx-auto">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] text-[#94a3b8]">Free to Start · No Credit Card</span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="font-syne font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(52px, 7vw, 80px)' }}>
            Your Syllabus.<br />Answered in <span className="text-blue-500">Seconds.</span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="mt-6 text-[18px] text-[#94a3b8] leading-[1.7] max-w-[540px] mx-auto font-dm-sans">
            Upload any course PDF. Ask anything in plain English. Stavlos finds the exact
            answer in your document — deadline, topic, grading policy, or date — instantly.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98] inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all inline-flex items-center gap-2">
              See how it works <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
            className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-[#475569]">
            <span>✓ No credit card required</span>
            <span>✓ Free to start</span>
            <span>✓ Works with any PDF</span>
          </motion.div>
        </div>

        {/* Hero Product Mockup */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="relative z-10 mt-16 w-full max-w-[900px] mx-auto px-4">
          <HeroMockup />
        </motion.div>
      </section>

      {/* ── S3: SOCIAL PROOF BAR ── */}
      <SocialProofBar />

      {/* ── S4: CORE FEATURE — SYLLABUS RAG ── */}
      <section id="features" className="py-[140px] md:py-[140px] px-5">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Explanation */}
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">The Core Feature</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold leading-[1.15]">
              Stop ctrl+F-ing your <span className="text-blue-500">syllabus.</span>
            </h2>
            <p className="text-[17px] text-[#94a3b8] leading-[1.75] font-dm-sans">
              Stavlos reads your entire course PDF — every deadline, grading policy,
              weekly schedule, and assignment — and turns it into something you can
              actually talk to. Ask in plain English. Get the exact answer, with the
              exact page reference.
            </p>
            <div className="space-y-3">
              {[
                'Works with any PDF — syllabus, lecture notes, course guides',
                'Answers always include the source section for verification',
                'Understands meaning and context, not just keyword matches',
              ].map(t => (
                <div key={t} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                  <span className="text-[15px] text-[#94a3b8]">{t}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" className="inline-flex items-center gap-1.5 text-blue-500 font-medium hover:underline text-[15px]">
              Try it free — no credit card needed <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Animated Q&A Demo */}
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            <QADemo />
          </motion.div>
        </div>
      </section>

      {/* ── S5: HOW IT WORKS — 3 STEPS ── */}
      <section className="py-[140px] px-5 bg-white/[0.01]">
        <div className="max-w-[1100px] mx-auto space-y-16">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="text-center space-y-4">
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold">From PDF to answer in under <span className="text-blue-500">2 minutes.</span></h2>
            <p className="text-[17px] text-[#94a3b8] max-w-[500px] mx-auto">No setup. No configuration. Drop in your PDF and start asking.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-[70px] left-[20%] right-[20%] h-px border-t border-dashed border-white/10" />
            <StepCard icon={Upload} num="01" title="Upload Your Syllabus" desc="Drag and drop any course PDF into Stavlos. It processes the entire document — every page — in under 30 seconds." />
            <StepCard icon={MessageSquare} num="02" title="Ask Anything" desc="Type your question in plain English — no special commands or syntax. Ask about deadlines, topics, grades, policies." />
            <StepCard icon={Sparkles} num="03" title="Get the Exact Answer" desc="Stavlos returns the precise answer from your document — not a guess, not a summary. The exact fact, with the source page cited." />
          </div>
        </div>
      </section>

      {/* ── S6: STUDY TOOLBOX ── */}
      <section id="tools" className="py-[140px] px-5">
        <div className="max-w-[1100px] mx-auto space-y-16">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">The Toolbox</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold"><span className="text-blue-500">Six</span> specialized study tools. One place.</h2>
            <p className="text-[17px] text-[#94a3b8] max-w-[500px] mx-auto">Not generic AI that can do everything badly. Six tools built specifically for the exact problems students face every single day.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ToolCard icon={Calculator} name="Math Solver" desc="Paste any equation or word problem. Every step explained." accent="amber" preview={'Step 1: Factor x² + 5x + 6\n→ (x + 2)(x + 3) = 0\nStep 2: x = -2 or x = -3 ✓'} />
            <ToolCard icon={FileText} name="Summarizer" desc="Condense any text into clear, scannable bullet points." accent="blue" preview={'• Main argument: climate change accelerates inequality\n• Key evidence: 3 peer-reviewed studies cited\n• Conclusion: policy intervention required by 2030'} />
            <ToolCard icon={CheckSquare} name="Grammar Fix" desc="Fix grammar and spelling errors while keeping your voice." accent="emerald" preview={'There are many reasons why\nstudents struggle with deadlines.'} />
            <ToolCard icon={PenTool} name="Essay Outliner" desc="Build a structured outline with PEEL or 5-paragraph format." accent="purple" preview={'Introduction\n  → Hook: startling statistic\n  → Thesis: your main argument\nBody 1 (PEEL)\n  → Point · Evidence · Explain · Link'} />
            <ToolCard icon={BookMarked} name="Citation Generator" desc="APA, MLA, Chicago — formatted correctly, instantly." accent="pink" preview={'APA:\nSmith, J. A. (2024). The future of\nlearning. Oxford University Press.'} />
            <ToolCard icon={Layers} name="Flashcard Generator" desc="Turn any notes into active recall flashcards in seconds." accent="orange" preview={'[FRONT] What is osmosis?\n[BACK]  Movement of water across a\n        semipermeable membrane'} />
          </div>

          <p className="text-center text-sm text-[#475569]">All tools included on Free and Pro plans.</p>
        </div>
      </section>

      {/* ── S7: MINI FEATURE HIGHLIGHTS ── */}
      <section className="py-[100px] px-5 bg-white/[0.01]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <HighlightCard icon={FileText} color="blue" title="Works with any course PDF" desc="Syllabus, lecture slides, study guides, course outlines. If it's a PDF, Stavlos can read it. No special formatting required." />
          <HighlightCard icon={Pin} color="emerald" title="Every answer is sourced" desc="Stavlos never guesses. Every answer includes the exact page and section it was pulled from, so you can verify it yourself." />
          <HighlightCard icon={BookOpen} color="purple" title="All your courses in one place" desc="Upload syllabi for every course. Switch between them in one click. No more switching tabs or searching different folders." />
        </div>
      </section>

      {/* ── S8: COMPARISON TABLE ── */}
      <section className="py-[140px] px-5">
        <div className="max-w-[1100px] mx-auto space-y-12">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">Why Stavlos</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold">The old way vs the <span className="text-blue-500">Stavlos</span> way.</h2>
          </motion.div>

          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-3 bg-white/[0.04] text-xs font-semibold uppercase tracking-wider">
              <div className="px-8 py-5 text-[#475569]">Situation</div>
              <div className="px-8 py-5 text-red-400/60">Without Stavlos</div>
              <div className="px-8 py-5 text-blue-500 bg-blue-500/[0.04]">With Stavlos ✓</div>
            </div>
            {[
              ['Find exam date', 'Ctrl+F through 40 pages, hope you find it', 'Ask "when is my exam?" — answer in 3 seconds'],
              ['Check deadline', 'Re-read the syllabus every single time', 'Ask instantly, get the exact date and requirements'],
              ['Grammar check', 'Open a separate app, paste, fix, copy back', 'One click inside Stavlos'],
              ['Format citation', 'Manually write it or use another website', 'Done in seconds, any format'],
              ['Solve math', 'Watch a YouTube video, search Stack Exchange', 'Step-by-step solution with every step explained'],
              ['Multiple courses', '4 tabs, 4 PDFs, 4 separate tools', 'Everything in one place'],
            ].map(([situation, without, withS], i) => (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-3 border-t border-white/[0.06] ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                <div className="px-8 py-4 text-sm text-white/50 font-medium">{situation}</div>
                <div className="px-8 py-4 text-sm text-[#94a3b8] flex items-start gap-2"><X className="w-4 h-4 text-red-400/50 mt-0.5 shrink-0" /> {without}</div>
                <div className="px-8 py-4 text-sm text-white flex items-start gap-2 bg-blue-500/[0.02]"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {withS}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── S9: PRICING ── */}
      <section id="pricing" className="py-[140px] px-5 bg-white/[0.01]">
        <div className="max-w-[1100px] mx-auto space-y-12">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">Pricing</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold">Simple, <span className="text-blue-500">honest</span> pricing.</h2>
            <p className="text-[17px] text-[#94a3b8] max-w-[540px] mx-auto">Start free. Upgrade when you need more. No hidden fees, no dark patterns, no &quot;cancel within 7 days or get charged&quot; nonsense.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[820px] mx-auto">
            {/* Free */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-10 space-y-6">
              <p className="text-lg font-syne font-bold">Free</p>
              <div><span className="text-5xl font-syne font-bold">€0</span><span className="text-[#94a3b8] ml-2 text-sm">/month</span></div>
              <div className="h-px bg-white/[0.08]" />
              <ul className="space-y-3">
                {['10 questions per day', '1 syllabus upload', 'Math Solver, Summarizer, Grammar Fix', 'No credit card required'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#94a3b8]"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all">Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="relative bg-blue-500/[0.05] border border-blue-500/40 rounded-[20px] p-10 space-y-6" style={{ boxShadow: '0 0 40px rgba(59,130,246,0.12)' }}>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
              <p className="text-lg font-syne font-bold">Pro</p>
              <div><span className="text-5xl font-syne font-bold">€8</span><span className="text-[#94a3b8] ml-2 text-sm">/month</span></div>
              <div className="h-px bg-blue-500/20" />
              <ul className="space-y-3">
                {['Unlimited questions', 'Unlimited syllabus uploads', 'All 6 study tools', 'Priority support', 'Early access to new features', 'Price locked forever'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#94a3b8]"><Check className="w-4 h-4 text-blue-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center px-6 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all">Upgrade to Pro <ArrowRight className="w-4 h-4 inline ml-1" /></Link>
            </div>
          </div>

          {/* Waitlist Referral Discount */}
          <WaitlistDiscount />

          <p className="text-center text-sm text-[#475569]">Cancel anytime. No questions asked. Payments processed securely by Stripe.</p>
        </div>
      </section>

      {/* ── S10: FAQ ── */}
      <section id="faq" className="py-[140px] px-5">
        <div className="max-w-[700px] mx-auto space-y-12">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="text-center">
            <h2 className="text-[clamp(28px,4vw,40px)] font-syne font-bold">Questions? We&apos;ve got <span className="text-blue-500">answers.</span></h2>
          </motion.div>
          <div className="space-y-3">
            <FAQ q="How does the syllabus reading actually work?" a="You upload a PDF and Stavlos splits it into sections, converts them into vector embeddings, and stores them in a database. When you ask a question, Stavlos finds the most relevant sections and passes them to the AI along with your question. The AI answers based only on what's in your document." />
            <FAQ q="What file types does Stavlos support?" a="Currently PDF only. Support for Word documents and plain text files is coming soon. Most syllabi and course documents are already in PDF format so this covers the majority of use cases." />
            <FAQ q="Is my data private and secure?" a="Yes. Your syllabus files are processed and stored encrypted. They're linked to your account only — no other user can access them. We don't train AI models on your data. Your files are yours." />
            <FAQ q="Can I use it for multiple courses at the same time?" a="Yes. You can upload syllabi for as many courses as you want. In the chat, you select which course you want to ask about using the dropdown — Stavlos will only search that specific syllabus." />
            <FAQ q="What's the difference between Free and Pro?" a="Free gives you 10 questions per day, 1 syllabus upload, and access to 3 tools. Pro removes all limits — unlimited questions, unlimited syllabi, all 6 tools, and priority support." />
            <FAQ q="How accurate are the answers?" a="Very accurate for factual information in the document — dates, requirements, grading policies. Less reliable for interpretation questions. Every answer includes a source reference so you can always verify it yourself." />
            <FAQ q="Can I cancel my Pro subscription anytime?" a='Yes. Cancel from your account settings, takes effect at the end of your billing period. No cancellation fees, no awkward retention flows, no "are you sure you want to leave?" popups.' />
          </div>
        </div>
      </section>

      {/* ── S11: FINAL CTA ── */}
      <section className="py-[140px] px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-[600px] mx-auto space-y-8">
          <h2 className="text-[clamp(36px,5vw,56px)] font-syne font-bold leading-[1.1]">Stop searching.<br />Start <span className="text-blue-500">knowing.</span></h2>
          <p className="text-[17px] text-[#94a3b8]">Join thousands of students who found a better way to study.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-xl transition-all active:scale-[0.98]">
            Get Started Free — No Credit Card <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-[#475569]">
            <span>✓ Free to start</span>
            <span>✓ Works immediately</span>
            <span>✓ No credit card</span>
          </div>
        </div>
      </section>

      {/* ── S12: FOOTER ── */}
      <LandingFooter />
    </div>
  )
}

/* ═══════════════════  COMPONENTS  ═══════════════════ */

/* ── Hero Mockup ── */
function HeroMockup() {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 120px rgba(59,130,246,0.10)' }}>
      <div className="bg-[#0c0c12]">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
          <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/40" /><span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" /></div>
          <div className="flex-1 text-center text-[11px] text-white/20">stavlos.com/chat</div>
        </div>
        {/* Mode pills */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] overflow-x-auto">
          {['General', 'Math', 'Grammar'].map(m => <span key={m} className="px-3 py-1 text-xs text-white/30 rounded-lg bg-white/[0.04] whitespace-nowrap">{m}</span>)}
          <span className="px-3 py-1 text-xs text-blue-400 rounded-lg bg-blue-500/10 border border-blue-500/20 whitespace-nowrap font-medium">Syllabus</span>
          {['Summary', 'Essay', 'Flashcards'].map(m => <span key={m} className="px-3 py-1 text-xs text-white/30 rounded-lg bg-white/[0.04] whitespace-nowrap">{m}</span>)}
        </div>
        <div className="px-4 py-2 border-b border-white/[0.06] text-xs text-white/30">📄 Course: Biology 101 ▾</div>
        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[200px]">
          <div className="flex justify-end"><div className="bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[280px]">When is my final exam?</div></div>
          <div className="flex justify-start"><div className="bg-white/[0.04] border border-white/[0.08] text-white text-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[400px] space-y-2">
            <p>Your final exam is <strong>December 18th</strong> from 10:00 AM – 12:00 PM in Hall B, Room 204.</p>
            <p className="text-blue-400 text-xs italic">📎 Source: Week 15 schedule, page 4</p>
          </div></div>
        </div>
      </div>
    </div>
  )
}

/* ── Cycling Q&A Demo ── */
function QADemo() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % QA_EXAMPLES.length), 4500)
    return () => clearInterval(t)
  }, [])
  const ex = QA_EXAMPLES[idx]

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-[#94a3b8]">
        📄 Biology 101 — Syllabus.pdf
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4 min-h-[160px]">
          <div className="flex justify-end"><div className="bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md">{ex.q}</div></div>
          <div className="flex justify-start"><div className="bg-white/[0.04] border border-white/[0.08] text-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[380px] space-y-2">
            <p className="text-white/90">{ex.a}</p>
            <p className="text-blue-400 text-xs italic">📎 Source: {ex.src}</p>
          </div></div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2">
        {QA_EXAMPLES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-blue-500 w-4' : 'bg-white/20 hover:bg-white/40'}`} />
        ))}
      </div>
    </div>
  )
}

/* ── Step Card ── */
function StepCard({ icon: Icon, num, title, desc }: any) {
  return (
    <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 space-y-5 relative overflow-hidden hover:border-white/[0.16] transition-all">
      <span className="absolute top-4 right-6 text-[64px] font-syne font-bold text-blue-500/[0.08] leading-none">{num}</span>
      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-widest text-[#475569] mb-3">Step {num}</p>
        <Icon className="w-8 h-8 text-white mb-4" />
        <h3 className="text-[20px] font-syne font-bold mb-2">{title}</h3>
        <p className="text-[15px] text-[#94a3b8] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

/* ── Tool Card ── */
function ToolCard({ icon: Icon, name, desc, accent, preview }: any) {
  const accentMap: Record<string, string> = {
    amber: 'text-amber-500 hover:border-amber-500/30',
    blue: 'text-blue-500 hover:border-blue-500/30',
    emerald: 'text-emerald-500 hover:border-emerald-500/30',
    purple: 'text-purple-500 hover:border-purple-500/30',
    pink: 'text-pink-500 hover:border-pink-500/30',
    orange: 'text-orange-500 hover:border-orange-500/30',
  }
  return (
    <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-4 transition-all ${accentMap[accent] || ''}`}>
      <Icon className={`w-9 h-9 ${accentMap[accent]?.split(' ')[0] || 'text-white'}`} />
      <h3 className="text-[18px] font-syne font-bold">{name}</h3>
      <p className="text-[14px] text-[#94a3b8]">{desc}</p>
      <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
        <pre className="text-[12px] text-white/50 font-mono whitespace-pre-wrap leading-relaxed">{preview}</pre>
      </div>
    </motion.div>
  )
}

/* ── Highlight Card ── */
function HighlightCard({ icon: Icon, color, title, desc }: any) {
  const cls: Record<string, string> = { blue: 'text-blue-500', emerald: 'text-emerald-500', purple: 'text-purple-500' }
  return (
    <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 space-y-4 hover:border-white/[0.16] transition-all">
      <Icon className={`w-8 h-8 ${cls[color] || 'text-white'}`} />
      <h3 className="text-[18px] font-syne font-bold">{title}</h3>
      <p className="text-[15px] text-[#94a3b8] leading-relaxed">{desc}</p>
    </motion.div>
  )
}

/* ── FAQ Accordion ── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="text-[15px] font-semibold pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#475569] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#475569] shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-6 pb-5 text-[15px] text-[#94a3b8] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Waitlist Discount ── */
function WaitlistDiscount() {
  const [ref, setRef] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function checkRef() {
    if (!ref.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`/api/waitlist/check?ref=${encodeURIComponent(ref.trim())}`)
      if (res.ok) {
        const data = await res.json()
        if (data.valid) {
          setStatus('success')
          setMsg('Referral verified! You qualify for the €5/month founding price.')
        } else {
          setStatus('error')
          setMsg('Referral code not found. Check the link and try again.')
        }
      } else {
        setStatus('error')
        setMsg('Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Connection error. Try again.')
    }
  }

  return (
    <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className="max-w-[820px] mx-auto bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎫</span>
        <h3 className="text-lg font-syne font-bold">Are you from the waitlist? Get your €5 discount!</h3>
      </div>
      <p className="text-sm text-[#94a3b8]">Paste your referral link below to unlock the founding member price of <strong className="text-white">€5/month</strong> instead of €8.</p>
      <div className="flex gap-3">
        <input
          value={ref}
          onChange={e => { setRef(e.target.value); setStatus('idle') }}
          placeholder="https://waitlist.stavlos.com?ref=abc123ef"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/20"
        />
        <button onClick={checkRef} disabled={status === 'loading' || !ref.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 whitespace-nowrap">
          {status === 'loading' ? 'Checking...' : 'Verify'}
        </button>
      </div>
      {msg && (
        <p className={`text-sm font-medium ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg}</p>
      )}
    </motion.div>
  )
}


/* ── Social Proof Bar (real data) ── */
function SocialProofBar() {
  const [stats, setStats] = useState<{ students: number; syllabi: number } | null>(null)

  useEffect(() => {
    fetch('/api/stats/public')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats({ students: 0, syllabi: 0 }))
  }, [])

  return (
    <section className="bg-white/[0.025] border-y border-white/[0.06] py-5">
      <div className="max-w-[1100px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-white font-bold text-lg font-syne">
            {stats ? stats.students.toLocaleString() : <span className="inline-block w-12 h-5 bg-white/5 rounded animate-pulse" />}
          </span>
          <span className="text-[#94a3b8] text-sm ml-1.5">students</span>
        </div>
        <div>
          <span className="text-white font-bold text-lg font-syne">
            {stats ? stats.syllabi.toLocaleString() : <span className="inline-block w-12 h-5 bg-white/5 rounded animate-pulse" />}
          </span>
          <span className="text-[#94a3b8] text-sm ml-1.5">syllabi uploaded</span>
        </div>
        <div>
          <span className="text-white font-bold text-lg font-syne">~3 sec</span>
          <span className="text-[#94a3b8] text-sm ml-1.5">average answer</span>
        </div>
        <div>
          <span className="text-white font-bold text-lg font-syne">🇳🇱</span>
          <span className="text-[#94a3b8] text-sm ml-1.5">Built in Amersfoort</span>
        </div>
      </div>
    </section>
  )
}
