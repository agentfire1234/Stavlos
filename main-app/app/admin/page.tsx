'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
    const [budget, setBudget] = useState(20)
    const [overrides, setOverrides] = useState<Record<string, string>>({})
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchAdminData()
    }, [])

    async function fetchAdminData() {
        setLoading(true)
        try {
            // Get Configs
            const configResp = await fetch('/api/admin/config')
            const configs = await configResp.json()

            const budgetConfig = configs.find((c: any) => c.key === 'daily_budget_eur')
            const overridesConfig = configs.find((c: any) => c.key === 'model_overrides')

            if (budgetConfig) setBudget(parseFloat(budgetConfig.value))
            if (overridesConfig) setOverrides(JSON.parse(overridesConfig.value))

            // Get Stats
            const statsResp = await fetch('/api/admin/stats')
            const statsData = await statsResp.json()
            setStats(statsData)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    async function updateConfig(key: string, value: any) {
        setSaving(true)
        try {
            await fetch('/api/admin/config', {
                method: 'POST',
                body: JSON.stringify({ key, value })
            })
            if (key === 'daily_budget_eur') setBudget(value)
            if (key === 'model_overrides') setOverrides(value)
        } catch (e) {
            alert('Failed to update config')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12 space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tight mb-2">Platform Command</h1>
                    <p className="text-white/40 font-medium">Abraham's private control center for Stavlos.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={fetchAdminData} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full font-bold text-xs hover:bg-white/10 transition">REFRESH DATA</button>
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-black uppercase tracking-tighter self-center">System Live</div>
                </div>
            </header>

            {/* Financial Overview */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Budget Controller */}
                <div className="lg:col-span-2 glass-card p-10 border-blue-500/10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Financial Safety</p>
                            <h2 className="text-3xl font-black">Daily Burn Limit</h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Global Kill Switch</span>
                            <button
                                onClick={() => updateConfig('kill_switch', !stats?.killSwitch)}
                                className={`
                                    px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                                    ${stats?.killSwitch ? 'bg-red-600 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:bg-white/10'}
                                `}
                            >
                                {stats?.killSwitch ? 'SYSTEM STOPPED' : 'SYSTEM LIVE'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <span className="text-7xl font-black tracking-tighter">€{budget}</span>
                            <div className="text-right">
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Current Protection</p>
                                <p className={`text-sm font-bold ${stats?.phase === 'NORMAL' ? 'text-green-400' : 'text-orange-400'}`}>
                                    PHASE: {stats?.phase || 'NORMAL'}
                                </p>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="5"
                            max="500"
                            step="5"
                            value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            onMouseUp={() => updateConfig('daily_budget_eur', budget)}
                            className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                        />

                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            <span>€5 MIN</span>
                            <span>€250 MID</span>
                            <span>€500 MAX</span>
                        </div>
                    </div>
                </div>

                {/* Profit / Revenue Tracker */}
                <div className="glass-card p-10 border-green-500/10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-xl font-black uppercase tracking-widest text-green-400">Net Profit</h2>
                            <div className="text-3xl">📈</div>
                        </div>
                        <p className="text-6xl font-black tracking-tighter mb-2">€{stats?.estProfit || '0.00'}</p>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Revenue: €{stats?.revenue || '0.00'}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/40">Gross Margin</span>
                            <span className="text-green-400">
                                {stats?.revenue > 0 ? ((stats.estProfit / stats.revenue) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Consumption Meter */}
                <div className="glass-card p-10 border-purple-500/10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-xl font-black uppercase tracking-widest text-purple-400">Burn</h2>
                            <div className="text-3xl">🔥</div>
                        </div>
                        <p className="text-4xl font-black tracking-tighter mb-2">€{stats?.spent?.toFixed(3) || '0.00'}</p>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Resets in: {stats?.resetsIn}</p>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/40">Used</span>
                            <span className="text-purple-400">{stats?.percentUsed?.toFixed(1) || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-1000"
                                style={{ width: `${Math.min(stats?.percentUsed || 0, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Stats & Model Control */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Stats Grid */}
                <div className="lg:col-span-1 space-y-6">
                    <MiniStat label="Users" value={stats?.totalUsers} color="text-blue-400" />
                    <MiniStat label="Files" value={stats?.totalSyllabi} color="text-purple-400" />
                    <MiniStat label="Calls" value={stats?.totalCalls} color="text-pink-400" />
                    <MiniStat label="Profit" value={`€${stats?.estProfit}`} color="text-green-400" />
                </div>

                {/* Model Overrides / Config Editor */}
                <div className="lg:col-span-3 glass rounded-[2.5rem] p-10 border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black italic">Dynamic Model Routing</h2>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">Override factory defaults for specific tasks.</p>
                        </div>
                        {saving && <span className="text-[10px] font-black text-blue-500 animate-pulse tracking-widest">PUSHING CONFIG...</span>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <ModelSelector
                            task="General Chat"
                            current={overrides['general_chat'] || 'llama-3.1-70b'}
                            onChange={(val) => updateConfig('model_overrides', { ...overrides, 'general_chat': val })}
                        />
                        <ModelSelector
                            task="Syllabus QA (RAG)"
                            current={overrides['syllabus_qa'] || 'llama-3.1-70b'}
                            onChange={(val) => updateConfig('model_overrides', { ...overrides, 'syllabus_qa': val })}
                        />
                        <ModelSelector
                            task="Essay Generator"
                            current={overrides['essay_outline'] || 'llama-3.1-70b'}
                            onChange={(val) => updateConfig('model_overrides', { ...overrides, 'essay_outline': val })}
                        />
                        <ModelSelector
                            task="Flashcard Generator"
                            current={overrides['flashcard'] || 'llama-3.1-8b'}
                            onChange={(val) => updateConfig('model_overrides', { ...overrides, 'flashcard': val })}
                        />
                    </div>
                </div>
            </div>

            {/* Audit Logs */}
            <div className="glass rounded-[2.5rem] p-10 border-white/5 overflow-hidden">
                <h2 className="text-2xl font-black mb-8 px-2">Activity Audit Log</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
                                <th className="pb-6 pl-4">Timestamp</th>
                                <th className="pb-6">Operation</th>
                                <th className="pb-6">Engine</th>
                                <th className="pb-6 text-right">Cost</th>
                                <th className="pb-6 text-center pr-4">Cache</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {stats?.recentLogs?.map((log: any) => (
                                <tr key={log.id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 text-white/30 pl-4">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                    <td className="py-5">
                                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-white/10 group-hover:border-white/20 transition-colors">
                                            {log.event_type}
                                        </span>
                                    </td>
                                    <td className="py-5 font-mono text-[11px] text-white/50">{log.model_used}</td>
                                    <td className="py-5 text-right font-mono text-blue-400">€{log.cost.toFixed(5)}</td>
                                    <td className="py-5 text-center pr-4">
                                        <div className={`w-2 h-2 rounded-full mx-auto ${log.cache_hit ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function MiniStat({ label, value, color }: any) {
    return (
        <div className="glass rounded-3xl p-6 border-white/5 flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{label}</p>
            <p className={`text-3xl font-black tracking-tighter ${color}`}>{value || 0}</p>
        </div>
    )
}

function ModelSelector({ task, current, onChange }: { task: string, current: string, onChange: (val: string) => void }) {
    const models = [
        { id: 'llama-3.1-8b-instant', label: '8B Instant (Cheap)', info: '€0.05/1M' },
        { id: 'llama-3.1-70b-versatile', label: '70B Versatile (Best)', info: '€0.70/1M' }
    ]

    return (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">{task}</span>
            </div>
            <select
                value={current}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer"
            >
                {models.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                ))}
            </select>
            <span className="text-[9px] font-black text-white/20 tracking-tighter self-end">{models.find(m => m.id === current)?.info}</span>
        </div>
    )
}
