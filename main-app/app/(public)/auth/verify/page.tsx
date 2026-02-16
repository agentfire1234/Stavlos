'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VerifyContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-[500px] p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/20 text-blue-500 text-4xl mb-8 animate-pulse">
                    📧
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-4">Abraham here.</h1>
                <p className="text-xl text-white/80 mb-6">
                    Just need to make sure you're a real human. Check your inbox!
                </p>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                    <p className="text-sm text-white/40 mb-1 uppercase tracking-widest font-bold">Verification link sent to</p>
                    <p className="text-lg font-mono text-blue-400">{email || 'your email'}</p>
                </div>

                <p className="text-white/40 mb-10">
                    Didn't get it? Check your spam folder or wait a moment.
                </p>

                <Link
                    href="/auth/login"
                    className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}
