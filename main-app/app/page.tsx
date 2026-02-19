'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20" />
            <span className="text-2xl font-black tracking-tighter italic">STAVLOS</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition">Pricing</Link>
            <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/90 transition shadow-xl">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-48 pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-in fade-in slide-in-from-top-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Main Product App Live</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] animate-in fade-in fill-mode-both duration-1000 slide-in-from-bottom-8">
              MASTER YOUR <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">SYLLABUS.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 font-medium mb-12 animate-in fade-in duration-1000 delay-300 slide-in-from-bottom-4">
              The AI study partner that knows exactly what's on your exam.
              Upload your syllabus and start mastering your GPA today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in duration-1000 delay-500 slide-in-from-bottom-4">
              <Link href="/login" className="px-10 py-5 bg-blue-600 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-blue-500 transition shadow-2xl shadow-blue-600/30">
                Start Studying Now
              </Link>
              <Link href="/pricing" className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-white/10 transition backdrop-blur-md">
                View Pro Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            <FeatureCard
              emoji="🧠"
              title="Context Aware"
              desc="Our RAG engine indexes your syllabus to provide answers grounded in your specific course content."
            />
            <FeatureCard
              emoji="⚡"
              title="Ultra Fast"
              desc="Powered by Llama 3.1 and Groq for near-instant responses. No more waiting for 'thinking' bars."
            />
            <FeatureCard
              emoji="🛡️"
              title="Abraham-Built"
              desc="Privacy first. Secure encryption. Designed by a student, for students. Master your future."
            />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 italic">READY TO SLAY THE SEMESTER?</h2>
            <p className="text-white/40 font-bold mb-10 relative z-10">Join 1,000+ students mastering their courses with Stavlos.</p>
            <Link href="/login" className="relative z-10 px-12 py-6 bg-white text-black rounded-full font-black uppercase text-sm tracking-[0.2em] hover:scale-105 transition active:scale-95 shadow-2xl">
              GET ACCESS
            </Link>
          </div>
        </section>
      </main>

      <footer className="pt-32 pb-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black italic tracking-tighter mb-2">STAVLOS</span>
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Master Your Studies. Level Up Your GPA.</p>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Link href="/legal/privacy" className="hover:text-blue-500 transition">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-blue-500 transition">Terms</Link>
            <a href="mailto:Japonendeutch@gmail.com" className="hover:text-blue-500 transition">Contact</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ emoji, title, desc }: any) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2 group">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{emoji}</div>
      <h3 className="text-xl font-black mb-3 italic">{title}</h3>
      <p className="text-white/40 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}
