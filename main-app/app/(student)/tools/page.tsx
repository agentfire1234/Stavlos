import {
    Calculator,
    Zap,
    Type,
    AlignCenter,
    Brain,
    Quote,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const tools = [
    {
        id: 'math-solver',
        name: 'Math Solver',
        desc: 'Step-by-step logic for equations and concepts.',
        icon: Calculator,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        href: '/tools/math-solver'
    },
    {
        id: 'summarizer',
        name: 'Summarizer',
        desc: 'Condense long lectures or PDFs into key bullet points.',
        icon: Zap,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        href: '/tools/summarizer'
    },
    {
        id: 'grammar',
        name: 'Grammar Fix',
        desc: 'Professional editing and tone correction.',
        icon: Type,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        href: '/tools/grammar'
    },
    {
        id: 'essay-outline',
        name: 'Essay Outliner',
        desc: 'Structural PEEL planning for top-grade essays.',
        icon: AlignCenter,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        href: '/tools/essay-outline'
    },
    {
        id: 'flashcards',
        name: 'Flashcard Gen',
        desc: 'Active recall sets powered by your notes.',
        icon: Brain,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        href: '/tools/flashcards'
    },
    {
        id: 'citations',
        name: 'Citations',
        desc: 'Automatic APA/MLA academic formatting.',
        icon: Quote,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        href: '/tools/citations'
    }
]

export default function ToolsHubPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32">
            <div className="max-w-5xl mx-auto space-y-12">
                <header>
                    <h1 className="text-6xl font-black tracking-tight italic mb-2">Study OS Toolbox</h1>
                    <p className="text-white/40 font-medium">The high-frequency toolset for modern students.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map(tool => (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            className="group glass-card p-10 flex flex-col justify-between hover:border-white/20 transition-all border-white/5 active:scale-95"
                        >
                            <div className="space-y-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bg} ${tool.color}`}>
                                    <tool.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic">{tool.name}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{tool.desc}</p>
                                </div>
                            </div>
                            <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                                Launch Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="pt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
                        Stay focused • Stay elite • Stavlos OS
                    </p>
                </div>
            </div>
        </div>
    )
}
