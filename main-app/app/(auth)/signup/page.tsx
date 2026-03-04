'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Logo } from '@/components/logo'
import toast from 'react-hot-toast'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        if (!email.trim() || !password || password.length < 6) {
            toast.error('Password must be at least 6 characters.')
            return
        }
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
                data: { display_name: name.trim() || undefined },
                emailRedirectTo: `${window.location.origin}/auth/confirm`
            }
        })
        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else if (data.user && !data.session) {
            // Email confirmation required
            toast.success('Check your email to confirm your account!')
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5 relative overflow-hidden -ml-0 md:-ml-60 py-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] space-y-8 relative z-10"
            >
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Logo size={32} className="text-blue-500" />
                        <span className="text-2xl font-bold font-syne tracking-tight"><span className="text-blue-500">S</span>TAVLOS</span>
                    </div>
                    <h1 className="text-2xl font-syne font-bold">Create your account</h1>
                    <p className="text-sm text-[#94a3b8] mt-1">Start studying smarter in under a minute.</p>
                </div>

                <form onSubmit={handleSignup} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#94a3b8]">Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#94a3b8]">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#94a3b8]">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Get Started Free</span><ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <p className="text-xs text-center text-[#475569]">No credit card required. Free plan included.</p>
                </form>

                <p className="text-center text-sm text-[#94a3b8]">
                    Already have an account? <Link href="/login" className="text-blue-500 hover:underline font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    )
}
