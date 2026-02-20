import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline'
    className?: string
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
    const variants = {
        primary: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] border-[var(--primary-blue)]/20",
        success: "bg-[var(--success-green)]/10 text-[var(--success-green)] border-[var(--success-green)]/20",
        warning: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        error: "bg-red-500/10 text-red-500 border-red-500/20",
        outline: "bg-transparent text-[var(--text-muted)] border-[var(--border)]"
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
