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
        <div className="min-h-screen bg-[#111318] text-white flex flex-col items-center justify-center px-6 text-center space-y-12">

            <div className="relative">
                <div className="absolute inset-0 bg-[#3b82f6]/10 blur-[100px] rounded-full scale-150 animate-pulse" />
                <div className="w-24 h-24 rounded-3xl bg-[#1e2128] border border-[#2d3139] flex items-center justify-center relative z-10 shadow-2xl">
                    <WifiOff className="w-10 h-10 text-[#3b82f6]" />
                </div>
            </div>

            <div className="space-y-4 max-w-[320px]">
                <h1 className="text-3xl font-bold font-syne text-[#e2e8f0]">You're <span className="text-[#3b82f6]">Offline</span></h1>
                <p className="text-[14px] font-medium font-dm-sans text-[#94a3b8] leading-relaxed">
                    Stavlos requires an active connection for processing. Your study materials will be available once you're back online.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[280px]">
                <button
                    onClick={() => window.location.reload()}
                    className="h-12 bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-3 transition-all"
                >
                    <RotateCcw className="w-4 h-4" /> Try again
                </button>
                <Link
                    href="/dashboard"
                    className="h-12 bg-[#1e2128] border border-[#2d3139] hover:border-[#3d4351] rounded-xl text-[14px] font-semibold text-[#e2e8f0] flex items-center justify-center gap-3 transition-all"
                >
                    <History className="w-4 h-4" /> Go to Dashboard
                </Link>
            </div>

            <div className="pt-12 flex items-center gap-6 opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#64748b]" />
                    <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Storage Locked</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#64748b]" />
                    <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">PWA Active</span>
                </div>
            </div>

            <p className="absolute bottom-8 text-[11px] font-medium text-[#475569] uppercase tracking-widest font-syne">Stavlos — v1.0.4</p>
        </div>
    )
}
