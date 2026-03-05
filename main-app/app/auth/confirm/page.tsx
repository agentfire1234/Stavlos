'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'

function ConfirmInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'verifying' | 'error'>('verifying')
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type') as EmailOtpType | null
        const next = searchParams.get('next') ?? '/dashboard'

        if (!token_hash || !type) {
            setErrorMsg('Invalid confirmation link. Please try signing up again.')
            setStatus('error')
            return
        }

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
            if (error) {
                setErrorMsg(error.message)
                setStatus('error')
            } else {
                // IMPORTANT: Add a slight delay to allow document.cookie to fully register 
                // in the browser before Next.js router navigates to the dashboard.
                // Without this, the middleware might check cookies before they are written.
                setTimeout(() => {
                    router.replace(next)
                }, 500)
            }
        })
    }, [searchParams, router])

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5 gap-6 text-center">
                <div className="text-4xl">❌</div>
                <h1 className="text-xl font-bold text-white">Verification failed</h1>
                <p className="text-[#94a3b8] text-sm max-w-[360px]">{errorMsg}</p>
                <a href="/signup" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all">
                    Try signing up again
                </a>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5 gap-6 text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[#94a3b8] text-sm">Verifying your email...</p>
        </div>
    )
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5 gap-6 text-center">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[#94a3b8] text-sm">Verifying your email...</p>
            </div>
        }>
            <ConfirmInner />
        </Suspense>
    )
}
