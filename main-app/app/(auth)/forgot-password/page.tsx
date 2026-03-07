'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Logo } from '@/components/logo'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordFormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: ''
        }
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                data.email.trim().toLowerCase(),
                {
                    redirectTo: `${process.env.NEXT_PUBLIC_URL || ''}/reset-password`,
                }
            )

            if (error) {
                toast.error(error.message)
            } else {
                setIsSuccess(true)
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
                    <div className="flex items-center justify-center mb-6">
                        <Logo size={48} className="text-white" />
                    </div>
                    <h1 className="text-[24px] font-syne font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-[14px] text-[#94a3b8] font-dm-sans">We'll send you a link to reset it.</p>
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
                            <h2 className="text-xl font-syne font-bold text-white">Check your email</h2>
                            <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                                We've sent a password reset link to your email. You can safely close this page.
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
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <span>Reset Password</span>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center border-t border-[rgba(255,255,255,0.08)] pt-6">
                                <p className="text-[14px] text-[#94a3b8]">
                                    Remember your password? <Link href="/login" className="text-[#3b82f6] hover:underline font-medium">Log in</Link>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
