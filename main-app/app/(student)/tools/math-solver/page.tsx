'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, Brain, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function MathSolverPage() {
    const [problem, setProblem] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{
        solution: string;
        steps: string[];
        concept: string;
    } | null>(null)

    const solveProblem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!problem.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: `Please solve this math problem step-by-step and explain the core concept: ${problem}`,
                    taskType: 'math_solver'
                })
            })
            const data = await res.json()

            // Artificial parsing for demonstration - in production, AI returns JSON via taskType
            // For now, using result.response as the solution
            setResult({
                solution: data.response,
                steps: data.steps || ["Analyzing core equation...", "Applying algebraic transformations...", "Calculating final result."],
                concept: "Mathematical Logic & Application"
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
                </Link>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Pro Tool: High Precision
                </div>
            </div>

            <div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
                    <Calculator className="w-10 h-10 text-blue-500" />
                    Math Solver
                </h1>
                <p className="text-white/40 font-medium text-lg max-w-2xl">
                    Stuck on a calculation? Paste your problem below. We don't just give the answer—we explain the "why" behind every step.
                </p>
            </div>

            {/* Input Area */}
            <form onSubmit={solveProblem} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                <div className="relative glass-card p-2 rounded-[2rem] flex flex-col md:flex-row gap-2">
                    <textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Paste your math problem here (e.g. Solve for x: 3x^2 + 6x = 0)..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-lg placeholder:text-white/20 resize-none min-h-[120px]"
                    />
                    <button
                        type="submit"
                        disabled={loading || !problem.trim()}
                        className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                Solve Step-by-Step
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Results Area */}
            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Concept Card */}
                        <div className="md:col-span-1 glass-card p-6 bg-blue-600/5 border-blue-500/20">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <Brain className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Core Concept</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{result.concept}</h3>
                            <p className="text-sm text-white/40 leading-relaxed">
                                Understanding this principle helps you solve similar problems in future exams.
                            </p>
                        </div>

                        {/* Steps Card */}
                        <div className="md:col-span-2 glass-card p-8">
                            <div className="flex items-center gap-2 mb-6 text-white/40">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Step-by-Step Logic</span>
                            </div>

                            <div className="space-y-6">
                                {result.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40">
                                            {idx + 1}
                                        </div>
                                        <p className="text-white/80 text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Final Answer</div>
                                <div className="text-2xl font-bold text-white selection:bg-blue-500/30">
                                    {result.solution}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
