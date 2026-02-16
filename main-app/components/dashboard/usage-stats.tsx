'use client'

interface StatCardProps {
    label: string
    value: string | number
    trend?: string
    color?: string
}

function StatCard({ label, value, trend, color = 'blue' }: StatCardProps) {
    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 blur-3xl rounded-full transition-transform group-hover:scale-150`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight text-white">{value}</h3>
                {trend && <span className="text-[10px] font-bold text-green-400">{trend}</span>}
            </div>
        </div>
    )
}

interface UsageStatsProps {
    usage: { used: number; limit: number }
    syllabusCount: number
    streak: number
    rank: number | string
}

export function UsageStats({ usage, syllabusCount, streak, rank }: UsageStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Waitlist Rank" value={`#${rank}`} color="blue" />
            <StatCard label="Active Syllabi" value={syllabusCount} color="purple" />
            <StatCard label="Daily Messages" value={`${usage.used}/${usage.limit}`} color="green" />
            <StatCard label="Study Streak" value={`${streak} Days`} trend="🔥" color="orange" />
        </div>
    )
}
