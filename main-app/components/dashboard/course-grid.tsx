'use client'

import Link from 'next/link'

interface CourseCardProps {
    id: string
    name: string
    updated: string
    color: string
}

function CourseCard({ id, name, updated, color }: CourseCardProps) {
    return (
        <Link href={`/syllabus/${id}`} className="group relative block">
            <div className={`absolute -inset-0.5 bg-gradient-to-br ${color} rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500`} />
            <div className="relative glass-card p-6 h-full flex flex-col justify-between transition-transform group-hover:-translate-y-1">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                            SYLLABUS
                        </span>
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                </div>
                <div className="mt-8 flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Uploaded {updated}</span>
                    <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
            </div>
        </Link>
    )
}

interface CourseGridProps {
    syllabuses: any[]
}

export function CourseGrid({ syllabuses }: CourseGridProps) {
    const colors = [
        'from-blue-600 to-cyan-500',
        'from-purple-600 to-pink-500',
        'from-orange-600 to-yellow-500',
        'from-green-600 to-emerald-500'
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabuses.map((syllabus, idx) => (
                <CourseCard
                    key={syllabus.id}
                    id={syllabus.id}
                    name={syllabus.course_name}
                    updated={new Date(syllabus.created_at).toLocaleDateString()}
                    color={colors[idx % colors.length]}
                />
            ))}

            <button className="relative group overflow-hidden rounded-2xl border border-dashed border-white/10 p-6 h-full min-h-[160px] flex flex-col items-center justify-center hover:border-white/20 transition-colors">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors" />
                <span className="text-3xl text-white/20 group-hover:text-white transition-colors mb-2">+</span>
                <span className="text-sm font-bold text-white/20 group-hover:text-white transition-colors">Upload New Syllabus</span>
                <p className="text-[10px] text-white/10 mt-1 uppercase tracking-tighter">PDF only</p>
            </button>
        </div>
    )
}
