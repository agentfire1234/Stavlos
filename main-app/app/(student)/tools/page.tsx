'use client'

import { motion } from 'framer-motion'
import {
    Calculator,
    FileText,
    CheckSquare,
    PenTool,
    BookMarked,
    Layers,
    ArrowRight,
    Lock
} from 'lucide-react'
import Link from 'next/link'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

const TOOLS = [
    {
        id: 'math-solver',
        name: 'Math Solver',
        desc: 'Step-by-step equation solving with full workings',
        icon: Calculator,
        color: 'amber',
        href: '/tools/math-solver'
    },
    {
        id: 'summarizer',
        name: 'Summarizer',
        desc: 'Condense any text into clear bullet points',
        icon: FileText,
        color: 'blue',
        href: '/tools/summarizer'
    },
    {
        id: 'grammar',
        name: 'Grammar Fix',
        desc: 'Professional tone correction, preserve your voice',
        icon: CheckSquare,
        color: 'emerald',
        href: '/tools/grammar'
    },
    {
        id: 'essay-outline',
        name: 'Essay Outliner',
        desc: 'PEEL and 5-paragraph structure generator',
        icon: PenTool,
        color: 'purple',
        href: '/tools/essay-outline'
    },
    {
        id: 'citations',
        name: 'Citation Gen',
        desc: 'APA, MLA, Chicago — formatted instantly',
        icon: BookMarked,
        color: 'pink',
        href: '/tools/citations'
    },
    {
        id: 'flashcards',
        name: 'Flashcard Gen',
        desc: 'Active recall cards from any notes',
        icon: Layers,
        color: 'orange',
        href: '/tools/flashcards'
    },
]

const UPCOMING = [
    { name: 'Essay Drafter', desc: 'AI-assisted first drafts' },
    { name: 'Quiz Generator', desc: 'Generate mock exams' },
]

export default function ToolsPage() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto px-6 py-12 space-y-12"
        >
            <header className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-syne italic leading-none">Modular Intelligence</p>
                <h1 className="text-5xl font-black font-syne uppercase italic tracking-tight">Study OS <span className="text-blue-500">Toolbox</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic max-w-sm">Six specialized tools. Zero searching. Just answers.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <motion.div
                        key={tool.id}
                        variants={item}
                        whileHover={{ y: -5, boxShadow: `0 0 30px var(--glow-${tool.color})` }}
                        className={`glass-card p-8 space-y-6 group cursor-pointer relative overflow-hidden`}
                    >
                        {/* Soft Glow Background */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[80px] rounded-full opacity-20 bg-${tool.color}-500`} />

                        <div className={`w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-${tool.color}-500/20 group-hover:border-${tool.color}-500/50 transition-all`}>
                            <tool.icon className={`w-7 h-7 text-${tool.color}-500 transition-transform group-hover:scale-110`} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-lg font-black font-syne uppercase italic tracking-wider transition-colors group-hover:text-white">{tool.name}</h2>
                            <p className="text-xs font-bold font-dm-sans text-white/30 leading-relaxed italic">{tool.desc}</p>
                        </div>

                        <Link
                            href={tool.href}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-${tool.color}-500 group-hover:gap-3 transition-all font-syne italic`}
                        >
                            Open Module <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <section className="pt-20 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-syne italic leading-none">Pipeline Roadmap</h2>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                    {UPCOMING.map((tool) => (
                        <div key={tool.name} className="glass-card p-6 flex items-center justify-between border-dashed border-white/10">
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest font-syne italic">{tool.name}</p>
                                <p className="text-[10px] font-bold text-white/20 font-dm-sans">{tool.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Lock className="w-3 h-3 text-white/20" />
                                <span className="text-[8px] font-black uppercase tracking-widest font-syne">Offline</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}
