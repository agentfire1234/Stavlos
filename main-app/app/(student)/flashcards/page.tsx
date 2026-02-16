'use client'

import { useState } from 'react'

export default function FlashcardsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Smart Flashcards</h1>
                <p className="text-white/40 font-medium">Automatic active recall generation from your syllabi.</p>
            </div>

            <div className="glass rounded-[2.5rem] p-12 text-center border-dashed">
                <div className="text-6xl mb-6">✨</div>
                <h2 className="text-2xl font-bold mb-4">Coming Soon: Automatic Flashcards</h2>
                <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                    Abraham is currently training the models to extract the most important definitions and concepts from your syllabi.
                    <br /><br />
                    Check back in a few days to start acing your exams!
                </p>
                <div className="mt-10 flex gap-4 justify-center">
                    <button className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm">Notify Me</button>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">View Roadmap</button>
                </div>
            </div>
        </div>
    )
}
