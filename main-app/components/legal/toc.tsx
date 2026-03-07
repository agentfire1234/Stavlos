'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface TocItem {
    id: string
    title: string
}

export function TableOfContents({ items }: { items: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>('')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const observers: IntersectionObserver[] = []

        items.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(id)
                        }
                    })
                },
                { rootMargin: '-20% 0px -80% 0px' }
            )

            observer.observe(el)
            observers.push(observer)
        })

        return () => {
            observers.forEach((obs) => obs.disconnect())
        }
    }, [items])

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        setIsOpen(false)
        const el = document.getElementById(id)
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100,
                behavior: 'smooth'
            })
        }
    }

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <nav className="hidden md:block w-[240px] shrink-0 sticky top-[100px] h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-4">
                <p className="text-sm font-syne font-bold text-white mb-4 tracking-wide uppercase">Contents</p>
                <ul className="space-y-2.5">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`text-sm block transition-all ${activeId === item.id
                                        ? 'text-blue-400 font-medium translate-x-1'
                                        : 'text-[#94a3b8] hover:text-white'
                                    }`}
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Accordion */}
            <div className="md:hidden block mb-8 bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <span className="text-[15px] font-syne font-bold">Table of Contents</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#475569]" /> : <ChevronDown className="w-5 h-5 text-[#475569]" />}
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ul className="px-5 pb-5 space-y-3">
                                {items.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            onClick={(e) => handleClick(e, item.id)}
                                            className={`text-sm block ${activeId === item.id ? 'text-blue-400 font-medium' : 'text-[#94a3b8]'
                                                }`}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
