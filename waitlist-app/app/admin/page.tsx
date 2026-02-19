'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
    total: number
    today: number
    thisWeek: number
    avgReferrals: number
    topReferrer: number
    usersWithTwoPlus: number
    rankDistribution: {
        founding: number
        earlyBird: number
        pioneer: number
        scholar: number
    }
}

interface WaitlistUser {
    email: string
    current_rank: number
    referral_count: number
    created_at: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            // Get all waitlist data
            const { data: rawData } = await supabase
                .from('waitlist_with_rank')
                .select('*')

            const waitlist = rawData as unknown as WaitlistUser[] | null

            if (!waitlist) {
                setLoading(false)
                return
            }

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

            // Calculate stats
            const signupsToday = waitlist.filter(u => new Date(u.created_at) >= today).length
            const signupsThisWeek = waitlist.filter(u => new Date(u.created_at) >= weekAgo).length

            const totalReferrals = waitlist.reduce((sum, u) => sum + (u.referral_count || 0), 0)
            const avgReferrals = waitlist.length > 0 ? (totalReferrals / waitlist.length).toFixed(1) : '0.0'
            const topReferrer = Math.max(...waitlist.map(u => u.referral_count || 0), 0)
            const usersWithTwoPlus = waitlist.filter(u => (u.referral_count || 0) >= 2).length
            const conversionRate = waitlist.length > 0 ? ((usersWithTwoPlus / waitlist.length) * 100).toFixed(1) : '0.0'

            const rankDist = {
                founding: waitlist.filter(u => u.current_rank <= 100).length,
                earlyBird: waitlist.filter(u => u.current_rank > 100 && u.current_rank <= 1000).length,
                pioneer: waitlist.filter(u => u.current_rank > 1000 && u.current_rank <= 2000).length,
                scholar: waitlist.filter(u => u.current_rank > 2000).length
            }

            setStats({
                total: waitlist.length,
                today: signupsToday,
                thisWeek: signupsThisWeek,
                avgReferrals: parseFloat(avgReferrals),
                topReferrer,
                usersWithTwoPlus,
                rankDistribution: rankDist
            })

        } catch (error) {
            console.error('Failed to load stats:', error)
        } finally {
            setLoading(false)
        }
    }

    async function exportCSV() {
        window.location.href = '/api/admin/export'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl text-red-500">Failed to load stats</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <h1 className="text-4xl font-bold mb-2">WAITLIST CONTROL CENTER</h1>
                <p className="text-white/60">Abraham's Dashboard</p>
            </div>

            {/* Main Stats */}
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
                    <p className="text-sm text-white/60 mb-2">Total Signups</p>
                    <p className="text-5xl font-bold mb-1">{stats.total.toLocaleString()}</p>
                    <p className="text-sm text-green-400">+{stats.today} today</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <p className="text-sm text-white/60 mb-2">This Week</p>
                    <p className="text-5xl font-bold mb-1">+{stats.thisWeek}</p>
                    <p className="text-sm text-white/40">New signups</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <p className="text-sm text-white/60 mb-2">Users with 2+ Referrals</p>
                    <p className="text-5xl font-bold mb-1">{stats.usersWithTwoPlus}</p>
                    <p className="text-sm text-white/40">
                        {((stats.usersWithTwoPlus / stats.total) * 100).toFixed(1)}% of total
                    </p>
                </div>
            </div>

            {/* Referral Stats */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Referral Statistics</h2>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-sm text-white/60 mb-2">Average Per User</p>
                            <p className="text-4xl font-bold">{stats.avgReferrals}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60 mb-2">Top Referrer</p>
                            <p className="text-4xl font-bold">{stats.topReferrer}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60 mb-2">Conversion Rate</p>
                            <p className="text-4xl font-bold">
                                {((stats.usersWithTwoPlus / stats.total) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-white/40 mt-1">Users getting discount</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rank Distribution */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Rank Distribution</h2>
                    <div className="grid grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-yellow-600/10 border border-yellow-500/30 rounded-xl">
                            <div className="text-3xl mb-2">⭐</div>
                            <p className="text-sm text-white/60 mb-1">Founding (1-100)</p>
                            <p className="text-3xl font-bold">{stats.rankDistribution.founding}</p>
                        </div>
                        <div className="text-center p-6 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                            <div className="text-3xl mb-2">🐦</div>
                            <p className="text-sm text-white/60 mb-1">Early Bird (101-1K)</p>
                            <p className="text-3xl font-bold">{stats.rankDistribution.earlyBird}</p>
                        </div>
                        <div className="text-center p-6 bg-purple-600/10 border border-purple-500/30 rounded-xl">
                            <div className="text-3xl mb-2">🚀</div>
                            <p className="text-sm text-white/60 mb-1">Pioneer (1K-2K)</p>
                            <p className="text-3xl font-bold">{stats.rankDistribution.pioneer}</p>
                        </div>
                        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-3xl mb-2">📚</div>
                            <p className="text-sm text-white/60 mb-1">Scholar (2K+)</p>
                            <p className="text-3xl font-bold">{stats.rankDistribution.scholar}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-4">
                    <button
                        onClick={exportCSV}
                        className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        📥 Export CSV
                    </button>
                    <button
                        onClick={loadStats}
                        className="px-8 py-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 font-semibold"
                    >
                        🔄 Refresh Data
                    </button>
                </div>
            </div>
        </div>
    )
}
