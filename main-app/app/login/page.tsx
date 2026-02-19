'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Redirect to dashboard
            router.push('/dashboard')
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
                    <h2 className="text-xl font-bold mt-6">Welcome Back</h2>
                    <p className="text-white/40 text-sm mt-2">Sign in to continue your journey.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Password</label>
                            <Link href="/auth/reset-password" title="Coming soon" className="text-[10px] text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-white/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center animate-in fade-in slide-in-from-top-1">
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-white/40 text-sm">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
