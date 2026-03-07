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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
}

const TOOLS = [
    {
        id: 'math-solver',
        name: 'Math Solver',
        desc: 'Step-by-step equation solving with full workings',
        icon: Calculator,
        color: 'amber',
        accent: '#f59e0b',
        href: '/tools/math-solver'
    },
    {
        id: 'summarizer',
        name: 'Summarizer',
        desc: 'Condense any text into clear bullet points',
        icon: FileText,
        color: 'blue',
        accent: '#3b82f6',
        href: '/tools/summarizer'
    },
    {
        id: 'grammar',
        name: 'Grammar Fix',
        desc: 'Professional tone correction, preserve your voice',
        icon: CheckSquare,
        color: 'emerald',
        accent: '#10b981',
        href: '/tools/grammar'
    },
    {
        id: 'essay-outline',
        name: 'Essay Outliner',
        desc: 'PEEL and 5-paragraph structure generator',
        icon: PenTool,
        color: 'purple',
        accent: '#8b5cf6',
        href: '/tools/essay-outline'
    },
    {
        id: 'citations',
        name: 'Citation Gen',
        desc: 'APA, MLA, Chicago — formatted instantly',
        icon: BookMarked,
        color: 'pink',
        accent: '#ec4899',
        href: '/tools/citations'
    },
    {
        id: 'flashcards',
        name: 'Flashcard Gen',
        desc: 'Active recall cards from any notes',
        icon: Layers,
        color: 'orange',
        accent: '#f97316',
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
            className="max-w-5xl mx-auto px-6 py-8 space-y-8"
        >
            <header>
                <h1 className="text-2xl font-bold font-syne text-[#e2e8f0]">Study Toolbox</h1>
                <p className="text-[15px] text-[#94a3b8] font-medium mt-1">
                    Specialized tools to help you study smarter and faster.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <Link key={tool.id} href={tool.href}>
                        <motion.div
                            variants={item}
                            whileHover={{ y: -4, borderColor: '#3d4351' }}
                            className="h-full bg-[#1e2128] border border-[#2d3139] rounded-xl p-6 flex flex-col justify-between group transition-all"
                        >
                            <div className="space-y-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${tool.accent}15`, color: tool.accent }}
                                >
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1.5">
                                    <h2 className="text-base font-semibold text-[#e2e8f0] font-syne">{tool.name}</h2>
                                    <p className="text-[13px] text-[#94a3b8] leading-relaxed font-medium">
                                        {tool.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-[12px] font-semibold text-[#64748b] group-hover:text-[#3b82f6] transition-colors">
                                Open tool <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <section className="pt-12 space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] font-syne">Coming Soon</h2>
                    <div className="flex-1 h-px bg-[#2d3139]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {UPCOMING.map((tool) => (
                        <div key={tool.name} className="bg-[#1e2128]/50 border border-[#2d3139] border-dashed rounded-xl p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-[#64748b]">{tool.name}</p>
                                <p className="text-[12px] text-[#475569] font-medium">{tool.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#111318]/50 border border-[#2d3139]">
                                <Lock className="w-3 h-3 text-[#475569]" />
                                <span className="text-[10px] font-bold text-[#475569] tracking-wider uppercase">Locked</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}
