'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium mb-1.5 ml-1 text-[var(--headline)]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full h-12 px-4 rounded-xl border border-[var(--border)] 
            bg-[var(--bg-main)] text-[var(--headline)] 
            placeholder:text-[var(--text-muted)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent 
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
