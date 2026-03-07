'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import {
    Calculator,
    FileText,
    CheckSquare,
    PenTool,
    BookMarked,
    Layers,
    MessageSquare,
    Upload,
    Search,
    User,
    Settings,
    LayoutDashboard,
    BookOpen,
    Wrench
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function CommandBar() {
    const [open, setOpen] = React.useState(false)
    const [recentChats, setRecentChats] = React.useState<any[]>([])
    const router = useRouter()

    const supabase = createClient()

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

    React.useEffect(() => {
        if (open) {
            async function getRecentChats() {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data } = await supabase
                        .from('chats')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('updated_at', { ascending: false })
                        .limit(5)
                    setRecentChats(data || [])
                }
            }
            getRecentChats()
        }
    }, [open])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4"
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" />

            <Command className="relative w-full max-w-2xl bg-[#0a0a10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center border-b border-white/5 px-4 h-14">
                    <Search className="w-4 h-4 text-white/40 mr-3" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 font-body"
                    />
                </div>

                <Command.List className="max-h-[450px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    <Command.Empty className="py-12 text-center text-xs text-white/40 font-medium">
                        No results found. Try searching for a tool or chat.
                    </Command.Empty>

                    <Command.Group heading={<span className="px-2 pb-1 text-[10px] font-black uppercase tracking-widest text-[#475569]">Quick Actions</span>}>
                        <CommandItem icon={MessageSquare} onSelect={() => runCommand(() => router.push('/chat/new'))} accent="blue">
                            New Chat
                        </CommandItem>
                        <CommandItem icon={Upload} onSelect={() => runCommand(() => router.push('/syllabus'))} accent="purple">
                            Upload Syllabus
                        </CommandItem>
                        <CommandItem icon={Calculator} onSelect={() => runCommand(() => router.push('/tools/math-solver'))} accent="amber">
                            Math Solver
                        </CommandItem>
                        <CommandItem icon={FileText} onSelect={() => runCommand(() => router.push('/tools/summarizer'))} accent="blue">
                            Summarizer
                        </CommandItem>
                        <CommandItem icon={CheckSquare} onSelect={() => runCommand(() => router.push('/tools/grammar'))} accent="emerald">
                            Grammar Fix
                        </CommandItem>
                        <CommandItem icon={PenTool} onSelect={() => runCommand(() => router.push('/tools/essay-outline'))} accent="purple">
                            Essay Outliner
                        </CommandItem>
                        <CommandItem icon={Layers} onSelect={() => runCommand(() => router.push('/tools/flashcards'))} accent="emerald">
                            Flashcards
                        </CommandItem>
                        <CommandItem icon={BookMarked} onSelect={() => runCommand(() => router.push('/tools/citations'))} accent="blue">
                            Citations
                        </CommandItem>
                    </Command.Group>

                    <Command.Group heading={<span className="px-2 py-1 pt-4 text-[10px] font-black uppercase tracking-widest text-[#475569]">Navigate</span>}>
                        <CommandItem icon={LayoutDashboard} onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            Dashboard
                        </CommandItem>
                        <CommandItem icon={MessageSquare} onSelect={() => runCommand(() => router.push('/chat'))}>
                            Chat
                        </CommandItem>
                        <CommandItem icon={BookOpen} onSelect={() => runCommand(() => router.push('/syllabus'))}>
                            My Syllabi
                        </CommandItem>
                        <CommandItem icon={Wrench} onSelect={() => runCommand(() => router.push('/tools'))}>
                            Tools
                        </CommandItem>
                        <CommandItem icon={Settings} onSelect={() => runCommand(() => router.push('/settings/profile'))}>
                            Settings
                        </CommandItem>
                    </Command.Group>

                    {recentChats.length > 0 && (
                        <Command.Group heading={<span className="px-2 py-1 pt-4 text-[10px] font-black uppercase tracking-widest text-[#475569]">Recent Chats</span>}>
                            {recentChats.map(chat => (
                                <CommandItem
                                    key={chat.id}
                                    icon={MessageSquare}
                                    onSelect={() => runCommand(() => router.push(`/chat/${chat.id}`))}
                                >
                                    {chat.title || 'Untitled Chat'}
                                </CommandItem>
                            ))}
                        </Command.Group>
                    )}
                </Command.List>

                <div className="flex items-center justify-between px-4 h-12 bg-white/[0.02] border-t border-white/5">
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
                </div>
            </Command>
        </Command.Dialog>
    )
}

function CommandItem({ children, icon: Icon, onSelect, className, accent }: any) {
    const accentColors: any = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        amber: 'text-amber-400',
        emerald: 'text-emerald-400'
    }

    return (
        <Command.Item
            onSelect={onSelect}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-default
                aria-selected:bg-white/[0.05] transition-colors font-body
                ${className}
            `}
        >
            <Icon className={`w-4 h-4 ${accent ? accentColors[accent] : 'text-slate-400'}`} />
            <span className="aria-selected:text-white text-slate-300">{children}</span>
        </Command.Item>
    )
}
