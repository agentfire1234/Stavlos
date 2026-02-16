'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import {
    Calculator,
    FileText,
    Languages,
    Layout,
    Search,
    User,
    CreditCard,
    LogOut,
    Plus
} from 'lucide-react'

export function CommandBar() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" />

            <Command className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center border-b border-white/5 px-4 h-14">
                    <Search className="w-4 h-4 text-white/40 mr-3" />
                    <Command.Input
                        placeholder="Search for tools, syllabi, or actions... (⌘K)"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20"
                    />
                </div>

                <Command.List className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                    <Command.Empty className="py-12 text-center text-xs text-white/40 font-medium">
                        No results found. Try searching for "Math" or "Settings".
                    </Command.Empty>

                    <Command.Group heading={<span className="px-2 pb-1 text-[10px] font-black uppercase tracking-widest text-white/20">Study Tools</span>}>
                        <CommandItem icon={Calculator} onSelect={() => runCommand(() => router.push('/tools/math-solver'))}>
                            Math Solver
                        </CommandItem>
                        <CommandItem icon={FileText} onSelect={() => runCommand(() => router.push('/tools/summarizer'))}>
                            Summarizer
                        </CommandItem>
                        <CommandItem icon={Languages} onSelect={() => runCommand(() => router.push('/tools/grammar'))}>
                            Grammar Fix
                        </CommandItem>
                        <CommandItem icon={Layout} onSelect={() => runCommand(() => router.push('/tools/essay-outline'))}>
                            Essay Outliner
                        </CommandItem>
                    </Command.Group>

                    <Command.Group heading={<span className="px-2 py-1 pt-4 text-[10px] font-black uppercase tracking-widest text-white/20">Quick Actions</span>}>
                        <CommandItem icon={Plus} onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            Upload New Syllabus
                        </CommandItem>
                        <CommandItem icon={User} onSelect={() => runCommand(() => router.push('/settings/profile'))}>
                            Profile Settings
                        </CommandItem>
                        <CommandItem icon={CreditCard} onSelect={() => runCommand(() => router.push('/settings/billing'))}>
                            Manage Subscription
                        </CommandItem>
                    </Command.Group>

                    <Command.Group heading={<span className="px-2 py-1 pt-4 text-[10px] font-black uppercase tracking-widest text-white/20">Account</span>}>
                        <CommandItem icon={LogOut} onSelect={() => runCommand(() => console.log('logout'))} className="text-red-400">
                            Log out
                        </CommandItem>
                    </Command.Group>
                </Command.List>

                <div className="flex items-center justify-between px-4 h-10 bg-white/[0.02] border-t border-white/5">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-sans">Enter</kbd>
                            <span className="text-[10px] text-white/20 uppercase tracking-tighter">to select</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-sans">Esc</kbd>
                            <span className="text-[10px] text-white/20 uppercase tracking-tighter">to close</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">Stavlos OS v1.0</span>
                </div>
            </Command>
        </Command.Dialog>
    )
}

function CommandItem({ children, icon: Icon, onSelect, className }: any) {
    return (
        <Command.Item
            onSelect={onSelect}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-default
                aria-selected:bg-white/[0.05] aria-selected:text-blue-400 transition-colors
                ${className}
            `}
        >
            <Icon className="w-4 h-4" />
            {children}
        </Command.Item>
    )
}
