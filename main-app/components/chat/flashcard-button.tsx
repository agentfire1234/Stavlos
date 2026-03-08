'use client'

import { Layers, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FlashcardButtonProps {
    setId: string
}

export function FlashcardButton({ setId }: FlashcardButtonProps) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push(`/flashcards/${setId}`)}
            className="w-full mt-3 p-4 bg-[#f97316]/10 border border-[#f97316]/30 rounded-xl flex items-center justify-between group hover:bg-[#f97316]/15 transition-all active:scale-[0.98]"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center text-[#f97316]">
                    <Layers size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white">Study Flashcards</p>
                    <p className="text-[11px] text-[#f97316]/70 font-medium">Click to start practice session</p>
                </div>
            </div>
            <ArrowRight size={18} className="text-[#f97316] group-hover:translate-x-1 transition-transform" />
        </button>
    )
}
