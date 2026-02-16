'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            // Redirect to verify page
            router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-[400px] p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-black tracking-tighter hover:opacity-80 transition">
                        STAVLOS
                    </Link>
                    <h2 className="text-xl font-bold mt-6">Create Account</h2>
                    <p className="text-white/40 text-sm mt-2">Join students stopping staring and starting mastering.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-white/20"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-white/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>

                    {message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center animate-in fade-in slide-in-from-top-1">
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-white/40 text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-blue-500 hover:underline font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
