'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Logo } from '@/components/logo'
import toast from 'react-hot-toast'
import { signInWithGoogleAction } from '@/app/actions/auth'

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

    function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
        return (
            <svg viewBox="0 0 24 24" {...props}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
        )
    }

    async function handleGoogleLogin() {
        await signInWithGoogleAction()
    }

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
                emailRedirectTo: `${window.location.origin}/auth/callback`
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

                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-[#94a3b8]">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <GoogleIcon className="w-5 h-5" />
                        <span>Continue with Google</span>
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
