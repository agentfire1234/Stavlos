'use client'

import { motion } from 'framer-motion'
import {
    WifiOff,
    RotateCcw,
    BookOpen,
    History,
    ShieldAlert,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 text-center space-y-12">

            <div className="relative">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full scale-150 animate-pulse" />
                <div className="w-24 h-24 rounded-[2.5rem] glass-card border-blue-500/20 flex items-center justify-center relative z-10 shadow-2xl">
                    <WifiOff className="w-10 h-10 text-blue-500" />
                </div>
            </div>

            <div className="space-y-4 max-w-sm">
                <h1 className="text-4xl font-black font-syne uppercase italic tracking-tighter">Neural Link <span className="text-blue-500">Offline</span></h1>
                <p className="text-xs font-bold font-dm-sans text-white/30 italic leading-relaxed">
                    Stavlos requires an active connection for RAG processing. Your cache is locked until synchronization.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary py-4 text-[10px] font-black uppercase tracking-widest font-syne italic flex items-center justify-center gap-3"
                >
                    <RotateCcw className="w-4 h-4" /> Re-index Protocol
                </button>
                <Link
                    href="/dashboard"
                    className="glass-card py-4 text-[10px] font-black uppercase tracking-widest font-syne italic text-white/40 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                    <History className="w-4 h-4" /> Last Cached Session
                </Link>
            </div>

            <div className="pt-12 flex items-center gap-6 opacity-20 grayscale grayscale-100">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest font-syne">Local Storage Locked</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest font-syne">PWA Active</span>
                </div>
            </div>

            <p className="absolute bottom-12 text-[8px] font-black uppercase tracking-[0.4em] text-white/10 font-syne italic">Protocol Stavlos — v1.0.4</p>
        </div>
    )
}
