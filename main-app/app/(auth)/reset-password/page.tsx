'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/logo'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')

const schema = z.object({
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof schema>

function PasswordStrengthIndicator({ password }: { password?: string }) {
    if (!password) return null

    const hasLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    const score = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length

    let color = 'bg-red-500'
    let text = 'Weak'

    if (score === 4) {
        color = 'bg-emerald-500'
        text = 'Strong'
    } else if (score >= 2) {
        color = 'bg-amber-500'
        text = 'Fair'
    }

    return (
        <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 flex gap-1 h-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 rounded-full ${i <= score ? color : 'bg-[rgba(255,255,255,0.1)]'}`} />
                ))}
            </div>
            <span className="text-[11px] font-medium text-[#94a3b8] w-10 text-right">{text}</span>
        </div>
    )
}

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const passwordValue = watch('password')

    const supabase = createClient()

    useEffect(() => {
        // Check if user is logged in (session established by callback)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('Invalid or expired reset link. Please try again.')
                router.push('/forgot-password')
            }
        }
        checkSession()
    }, [supabase, router])

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password
            })

            if (error) {
                toast.error(error.message)
            } else {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 3000)
            }
        } catch {
            toast.error('Something went wrong. Please try again.')
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
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
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Logo size={32} className="text-white" />
                        <span className="text-2xl font-bold font-syne tracking-tight text-white"><span className="text-[#3b82f6]">S</span>TAVLOS</span>
                    </div>
                    <h1 className="text-[24px] font-syne font-bold text-white mb-2">Create New Password</h1>
                    <p className="text-[14px] text-[#94a3b8] font-dm-sans">Enter your new secure password.</p>
                </div>

                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-6 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-syne font-bold text-white">Password Updated</h2>
                            <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                                Your password has been changed successfully. Redirecting you to the dashboard...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-1.5 pt-1">
                                    <label className="text-[14px] font-dm-sans text-white">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password')}
                                            className={`w-full bg-[rgba(255,255,255,0.04)] text-white border rounded-lg pl-4 pr-10 text-[14px] h-[44px] focus:outline-none focus:border-[rgba(59,130,246,0.6)] transition-colors placeholder:text-transparent ${errors.password ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
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
                                    <PasswordStrengthIndicator password={passwordValue} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-dm-sans text-white">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('confirmPassword')}
                                            className={`w-full bg-[rgba(255,255,255,0.04)] text-white border rounded-lg pl-4 pr-10 text-[14px] h-[44px] focus:outline-none focus:border-[rgba(59,130,246,0.6)] transition-colors placeholder:text-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                </div>

                                <div className="pt-2">
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
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <span>Reset Password</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
