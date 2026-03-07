'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Euro,
    Cpu,
    Activity,
    BarChart3,
    Power,
    Loader2,
    Clock,
    Database
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [killSwitch, setKillSwitch] = useState(false)
    const [budgetValue, setBudgetValue] = useState(20)
    const [savingConfig, setSavingConfig] = useState(false)

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            const res = await fetch('/api/admin/stats')
            if (res.ok) {
                const data = await res.json()
                setStats(data)
                const sysStatus = data.configs?.find((c: any) => c.key === 'system_status')?.value
                setKillSwitch(sysStatus === '0')
                const budget = data.configs?.find((c: any) => c.key === 'daily_budget_eur')?.value
                setBudgetValue(budget ? parseFloat(budget) : 20)
            }
        } catch {
            toast.error('Failed to load admin stats.')
        } finally {
            setLoading(false)
        }
    }

    async function toggleKillSwitch() {
        const newValue = !killSwitch
        setSavingConfig(true)
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'system_status', value: newValue ? '0' : '1' })
            })
            if (res.ok) {
                setKillSwitch(newValue)
                toast.success(newValue ? 'Kill switch activated.' : 'System restored.')
            }
        } catch {
            toast.error('Failed to toggle kill switch.')
        } finally {
            setSavingConfig(false)
        }
    }

    async function saveBudget() {
        setSavingConfig(true)
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'daily_budget_eur', value: String(budgetValue) })
            })
            if (res.ok) toast.success(`Budget set to €${budgetValue}/day`)
        } catch {
            toast.error('Failed to save budget.')
        } finally {
            setSavingConfig(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                <div className="h-24 glass-card animate-pulse bg-white/[0.02]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-32 animate-pulse bg-white/[0.02]" />)}
                </div>
                <div className="glass-card h-64 animate-pulse bg-white/[0.02]" />
            </div>
        )
    }

    const phase = stats?.phase || 'NORMAL'
    const spent = stats?.spent || 0
    const limit = stats?.limit || budgetValue
    const percentUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0

    const phaseColors: Record<string, string> = {
        NORMAL: 'text-emerald-500',
        CAUTIOUS: 'text-amber-500',
        RESTRICTED: 'text-orange-500',
        EMERGENCY: 'text-red-500',
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-12">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 font-syne italic leading-none">Administrative Node</p>
                    <h1 className="text-5xl font-black font-syne uppercase italic tracking-tight">System <span className="text-red-500">Core</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 ${!killSwitch ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        <div className={`w-2 h-2 rounded-full ${!killSwitch ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest font-syne ${!killSwitch ? 'text-emerald-500' : 'text-red-500'}`}>
                            {!killSwitch ? 'System Live' : 'Kill Switch Active'}
                        </span>
                    </div>
                    <button
                        onClick={toggleKillSwitch}
                        disabled={savingConfig}
                        className={`p-3 rounded-xl transition-all ${!killSwitch
                            ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                            }`}
                    >
                        <Power className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStat icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="blue" trend={`${stats?.totalCalls || 0} AI calls today`} />
                <AdminStat icon={Euro} label="Today's Spend" value={`€${spent.toFixed(2)}`} color="amber" trend={`Phase: ${phase}`} />
                <AdminStat icon={Database} label="Syllabuses" value={stats?.totalSyllabi || 0} color="purple" trend="RAG uploads" />
                <AdminStat icon={Clock} label="Resets In" value={stats?.resetsIn || '—'} color="emerald" trend="Budget cycle" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Budget Control */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic px-2">Budget Governor</h2>
                        <div className="glass-card p-10 space-y-8 border-white/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <BarChart3 className="w-40 h-40 text-blue-500" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase font-syne">
                                    <span className="text-white/40">Daily AI Budget</span>
                                    <span className={phaseColors[phase]}>{phase} — €{spent.toFixed(2)} / €{limit}</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-orange-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-4">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 font-syne whitespace-nowrap">Budget Cap</label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={budgetValue}
                                        onChange={(e) => setBudgetValue(Number(e.target.value))}
                                        className="flex-1 accent-blue-500"
                                    />
                                    <span className="text-sm font-black font-syne italic text-white min-w-[60px] text-right">€{budgetValue}</span>
                                    <button
                                        onClick={saveBudget}
                                        disabled={savingConfig}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest font-syne italic hover:bg-blue-500 transition-all disabled:opacity-50"
                                    >
                                        {savingConfig ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-8 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-black font-syne italic tracking-tighter">{stats?.totalCalls || 0}</p>
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Calls Today</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-black font-syne italic tracking-tighter">€{stats?.revenue || '0.00'}</p>
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Revenue</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-black font-syne italic tracking-tighter">€{stats?.estProfit || '0.00'}</p>
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Est. Profit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Phase Info + Recent Logs */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic px-2">Phase Breakdown</h2>
                        <div className="space-y-3">
                            {[
                                { phase: 'NORMAL', range: '0-50%', desc: 'All models active', color: 'emerald' },
                                { phase: 'CAUTIOUS', range: '50-75%', desc: 'Force 8B model', color: 'amber' },
                                { phase: 'RESTRICTED', range: '75-90%', desc: 'Free users queued', color: 'orange' },
                                { phase: 'EMERGENCY', range: '90%+', desc: 'Cache only', color: 'red' },
                            ].map((p) => (
                                <div
                                    key={p.phase}
                                    className={`glass-card p-4 flex items-center gap-4 ${phase === p.phase ? 'border-white/20' : 'border-white/5'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${p.color === 'emerald' ? 'bg-emerald-500' : p.color === 'amber' ? 'bg-amber-500' : p.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'} ${phase === p.phase ? 'animate-pulse' : 'opacity-30'}`} />
                                    <div className="flex-1">
                                        <p className={`text-[10px] font-black uppercase tracking-widest font-syne ${phase === p.phase ? 'text-white' : 'text-white/30'}`}>{p.phase}</p>
                                        <p className="text-[9px] text-white/20 font-dm-sans">{p.range} — {p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {stats?.recentLogs?.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-syne italic px-2">Recent Activity</h2>
                            <div className="space-y-2">
                                {stats.recentLogs.slice(0, 5).map((log: any, i: number) => (
                                    <div key={i} className="glass-card p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-white/50 font-dm-sans truncate max-w-[180px]">{log.event_type || log.model_used || 'query'}</p>
                                            <p className="text-[9px] text-white/20">{log.tokens_used || 0} tokens</p>
                                        </div>
                                        <span className="text-[9px] font-black text-amber-500 font-syne">€{Number(log.cost || 0).toFixed(4)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}

function AdminStat({ icon: Icon, label, value, color, trend }: any) {
    const colorMap: Record<string, string> = {
        blue: 'border-blue-500/10 bg-blue-500/5',
        emerald: 'border-emerald-500/10 bg-emerald-500/5',
        amber: 'border-amber-500/10 bg-amber-500/5',
        purple: 'border-purple-500/10 bg-purple-500/5',
    }
    return (
        <div className={`glass-card p-6 space-y-4 border ${colorMap[color] || colorMap.blue}`}>
            <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-white/40" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 font-syne">{trend}</span>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/40 font-syne leading-none mb-1">{label}</p>
                <p className="text-3xl font-black italic text-white font-syne tracking-tighter">{value}</p>
            </div>
        </div>
    )
}
