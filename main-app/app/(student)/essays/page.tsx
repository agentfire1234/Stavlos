'use client'

import { useState } from 'react'

export default function EssaysPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Essay Outline Tool</h1>
                <p className="text-white/40 font-medium">Generate PEEL-method outlines instantly.</p>
            </div>

            <div className="glass rounded-[2.5rem] p-12 text-center border-dashed">
                <div className="text-6xl mb-6">✍️</div>
                <h2 className="text-2xl font-bold mb-4">Coming Soon: Essay Outliner</h2>
                <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                    Stuck on a draft? Our AI outliner will soon be able to scan your course readings and build a structured argument for you.
                </p>
                <div className="mt-10 flex gap-4 justify-center">
                    <button className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm">Notify Me</button>
                </div>
            </div>
        </div>
    )
}
