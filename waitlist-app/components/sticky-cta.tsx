'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show after 600px of scrolling (roughly past the hero)
            if (window.scrollY > 600) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6"
                >
                    <div className="card-premium p-4 flex items-center justify-between bg-[var(--bg-main)]/90 backdrop-blur-xl border-[var(--primary-blue)]/30 shadow-2xl shadow-[var(--primary-blue)]/20">
                        <div className="hidden sm:block">
                            <p className="text-sm font-black italic uppercase tracking-tighter">Ready to join?</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">€5/mo locked forever</p>
                        </div>
                        <Button
                            onClick={scrollToTop}
                            size="sm"
                            className="w-full sm:w-auto px-8 h-12"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Claim Your Spot
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
