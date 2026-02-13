'use client'

import { useState } from 'react'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-md hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        STAVLOS
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/dashboard" icon="📊" active>Overview</NavItem>
                    <NavItem href="/chat" icon="💬">AI Chat</NavItem>
                    <NavItem href="/syllabus" icon="📚">My Syllabi</NavItem>
                    <NavItem href="/settings" icon="⚙️">Settings</NavItem>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-blue-400 font-bold mb-1">FREE PLAN</p>
                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-500 w-[60%]" />
                        </div>
                        <p className="text-xs text-white/40">Daily Usage: 12/20</p>
                        <button className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, Student</h1>
                        <p className="text-white/40 text-sm">Here's what's happening with your studies.</p>
                    </div>
                    <button className="md:hidden">MENU</button>
                </header>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ActionCard icon="📝" title="New Essay" desc="Generate an outline" />
                    <ActionCard icon="⚡" title="Flashcards" desc="Create from syllabus" />
                    <ActionCard icon="🐛" title="Debug Code" desc="Paste your error" />
                    <ActionCard icon="🗣️" title="Tutor Chat" desc="Ask anything" />
                </div>

                {/* Recent Syllabi */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Your Syllabi</h2>
                        <button className="text-sm text-blue-400 hover:text-blue-300">Upload New +</button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <SyllabusCard
                            code="CS101"
                            name="Intro to Computer Science"
                            status="Analyzed"
                            color="border-blue-500/30 bg-blue-500/5"
                        />
                        <SyllabusCard
                            code="ECON202"
                            name="Macroeconomics"
                            status="Analyzed"
                            color="border-green-500/30 bg-green-500/5"
                        />
                        <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-white/30 hover:border-white/40 hover:text-white/60 transition cursor-pointer h-32">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-sm">Upload Syllabus PDF</span>
                        </div>
                    </div>
                </section>

                {/* Today's Focus */}
                <section>
                    <h2 className="text-lg font-bold mb-4">Recommended Focus</h2>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">📅</div>
                            <div>
                                <h3 className="font-semibold mb-1">CS101 Midterm Prep</h3>
                                <p className="text-sm text-white/60 mb-3">
                                    Based on your syllabus, you have a midterm coming up in 5 days covering
                                    Algorithms and Data Structures.
                                </p>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-700">
                                        Start Quiz
                                    </button>
                                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10">
                                        Review Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

function NavItem({ href, icon, children, active = false }: any) {
    return (
        <a
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${active
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
        >
            <span>{icon}</span>
            {children}
        </a>
    )
}

function ActionCard({ icon, title, desc }: any) {
    return (
        <div className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-white/40">{desc}</p>
        </div>
    )
}

function SyllabusCard({ code, name, status, color }: any) {
    return (
        <div className={`p-6 border rounded-xl ${color}`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono px-2 py-1 rounded bg-black/20 text-white/60">{code}</span>
                <span className="text-xs text-green-400 flex items-center gap-1">
                    ● {status}
                </span>
            </div>
            <h3 className="font-bold mb-1">{name}</h3>
            <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-white/10 rounded-lg text-xs font-semibold hover:bg-white/20">
                    Chat
                </button>
                <button className="flex-1 py-2 bg-white/10 rounded-lg text-xs font-semibold hover:bg-white/20">
                    Quiz
                </button>
            </div>
        </div>
    )
}
