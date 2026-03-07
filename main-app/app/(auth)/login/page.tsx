'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Logo } from '@/components/logo'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof schema>

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

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email.trim().toLowerCase(),
                password: data.password,
            })

            if (error) {
                toast.error('Incorrect email or password')
            } else {
                router.push('/dashboard')
            }
        } catch {
            toast.error('Something went wrong. Please try again.')
        }
    }

    async function onGoogleLogin() {
        try {
            setGoogleLoading(true)
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
        } catch {
            toast.error('Google sign in failed. Please try again.')
            setGoogleLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: `radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.10) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.07) 0%, transparent 50%), #0a0a0f`
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px]"
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    padding: '40px'
                }}
            >
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <Logo size={48} className="text-white" />
                    </div>
                    <h1 className="text-[24px] font-syne font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-[14px] text-[#94a3b8] font-dm-sans">Continue your study journey.</p>
                </div>

                <button
                    type="button"
                    onClick={onGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 transition-all outline-none"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                        height: '44px',
                        borderRadius: '8px'
                    }}
                >
                    {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
                    <span className="text-sm font-medium">Continue with Google</span>
                </button>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
                    <span className="text-sm text-[#475569]">or</span>
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-dm-sans text-white">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className={`w-full bg-[rgba(255,255,255,0.04)] text-white border rounded-lg px-4 text-[14px] h-[44px] focus:outline-none focus:border-[rgba(59,130,246,0.6)] transition-colors placeholder:text-[#475569] ${errors.email ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[14px] font-dm-sans text-white">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full bg-[rgba(255,255,255,0.04)] text-white border rounded-lg pl-4 pr-10 text-[14px] h-[44px] focus:outline-none focus:border-[rgba(59,130,246,0.6)] transition-colors ${errors.password ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-end pt-1 pb-2">
                        <Link href="/forgot-password" className="text-[13px] text-[#3b82f6] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-semibold rounded-lg text-white text-[14px] flex items-center justify-center gap-2 transition-all"
                        style={{
                            height: '44px',
                            background: '#3b82f6',
                            border: 'none',
                            boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(59,130,246,0)',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                        onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.4)', e.currentTarget.style.background = '#2563eb')}
                        onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.boxShadow = 'none', e.currentTarget.style.background = '#3b82f6')}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[14px] text-[#94a3b8]">
                        Don&apos;t have an account? <Link href="/signup" className="text-[#3b82f6] hover:underline font-medium">Sign up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
