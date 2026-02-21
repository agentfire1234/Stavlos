'use client'

import React, { useState, useEffect } from 'react'
import {
    Users,
    UserPlus,
    Calendar,
    TrendingUp,
    Search,
    Download,
    MoreVertical,
    Mail,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'

export default function AdminDashboard() {
    const [authorized, setAuthorized] = useState(false)
    const [password, setPassword] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)

    // Auth Guard
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                setAuthorized(true)
                fetchAdminData()
            } else {
                const data = await res.json()
                alert(data.error || 'Unauthorized')
            }
        } catch (err) {
            alert('Login failed')
        } finally {
            setLoading(false)
        }
    }

    const fetchAdminData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/data')
            const data = await res.json()
            setUsers(data.users || [])
            setStats(data.stats || null)
        } catch (e) {
            console.error('Failed to fetch admin data')
        } finally {
            setLoading(false)
        }
    }

    const exportCSV = () => {
        const headers = ['Email', 'Signup Date', 'Rank', 'Referrals', 'Referred By']
        const rows = users.map(u => [u.email, u.created_at, u.rank, u.referral_count, u.referred_by])
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `stavlos-waitlist-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
                <div className="card-premium p-10 w-full max-w-md text-center">
                    <Logo size={48} className="mx-auto mb-8" />
                    <h1 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Enter secret key..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">Unlock Dashboard</Button>
                    </form>
                </div>
            </div>
        )
    }

    const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="min-h-screen bg-[var(--bg-section)] flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-[var(--bg-main)] border-r border-[var(--border)] hidden lg:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-12">
                    <Logo size={28} />
                    <span className="font-black tracking-tighter uppercase italic text-xl">Stavlos</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <AdminNavItem icon={<TrendingUp />} label="Overview" active />
                    <AdminNavItem icon={<Users />} label="Waitlist" />
                    <AdminNavItem icon={<ShieldCheck />} label="Security" />
                    <AdminNavItem icon={<Mail />} label="Broadcast" />
                </nav>

                <div className="pt-6 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-blue)] flex items-center justify-center text-white text-[10px] font-bold underline">AB</div>
                        <div>
                            <p className="text-sm font-bold">Abraham</p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-black">Founder</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <header className="h-20 bg-[var(--bg-main)] border-b border-[var(--border)] px-8 flex items-center justify-between sticky top-0 z-20">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" size="sm" onClick={fetchAdminData}>Refresh</Button>
                        <Button onClick={exportCSV} size="sm" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Signups" value={stats?.total || 0} icon={<Users />} trend="+12% this week" />
                        <StatCard title="Today" value={stats?.today || 0} icon={<UserPlus />} trend="+5 since hour" />
                        <StatCard title="Conversion" value="38.5%" icon={<TrendingUp />} trend="High" />
                        <StatCard title="Spots Left" value={2000 - (stats?.total || 0)} icon={<Calendar />} />
                    </div>

                    {/* Main Table Area */}
                    <div className="card-premium h-full overflow-hidden flex flex-col">
                        {/* Table Header Filter */}
                        <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-main)] flex items-center justify-between">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    placeholder="Search emails..."
                                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--bg-section)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">All Users</Badge>
                                <Badge variant="primary">Founding</Badge>
                            </div>
                        </div>

                        {/* Responsive Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-[var(--bg-section)] border-b border-[var(--border)]">
                                    <tr className="text-left">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">User</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Signed Up</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Position</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Referrals</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--bg-main)] divide-y divide-[var(--border)]">
                                    {filteredUsers.map((user, i) => (
                                        <tr key={i} className="hover:bg-[var(--bg-section)]/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm tracking-tight">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm">#{user.rank}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">{user.referral_count}</span>
                                                    {user.referral_count >= 2 && <Badge variant="success">10% Off</Badge>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={user.rank <= 2000 ? 'primary' : 'outline'}>
                                                    {user.rank <= 2000 ? 'Founding' : 'Standard'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-[var(--bg-section)] rounded-lg transition-colors text-[var(--text-muted)]">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-6 bg-[var(--bg-main)] border-t border-[var(--border)] flex items-center justify-between">
                            <p className="text-xs text-[var(--text-muted)]">Showing <strong>{filteredUsers.length}</strong> entries</p>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" className="h-8 w-8 p-0" disabled><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="secondary" size="sm" className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function AdminNavItem({ icon, label, active = false }: any) {
    return (
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all
      ${active ? 'bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-section)] hover:text-[var(--headline)]'}
    `}>
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
            {label}
        </div>
    )
}

function StatCard({ title, value, icon, trend }: any) {
    return (
        <div className="card-premium p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{title}</span>
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] flex items-center justify-center">
                    {React.cloneElement(icon, { className: 'w-4 h-4' })}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-black italic tracking-tighter mb-2">{value}</h3>
                {trend && <p className="text-[10px] font-bold text-[var(--success-green)]">{trend}</p>}
            </div>
        </div>
    )
}
