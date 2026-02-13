'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SyllabusPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setUploading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/syllabus/upload', {
                method: 'POST',
                headers: {
                    'x-user-id': 'demo-user' // Placeholder auth
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Upload failed')

            setMessage('✅ Syllabus uploaded & analyzed successfully!')
            setFile(null)
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar Placeholder (Duplicate for now, would be a component) */}
            <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:block p-6">
                <Link href="/dashboard" className="text-white/60 hover:text-white">← Back</Link>
            </aside>

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Syllabus Manager</h1>

                <div className="max-w-2xl">
                    {/* Upload Card */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Upload New Syllabus</h2>
                        <p className="text-white/60 text-sm mb-6">
                            Upload your course PDF. Stavlos will analyze dates, readings, and policies.
                        </p>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="text-4xl mb-2">📄</div>
                                {file ? (
                                    <p className="font-semibold text-blue-400">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="font-semibold">Click to upload PDF</p>
                                        <p className="text-xs text-white/40 mt-1">Max 10MB</p>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!file || uploading}
                                    className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Upload & Analyze'
                                    )}
                                </button>
                            </div>
                        </form>

                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* List */}
                    <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                    <div className="space-y-3">
                        {/* Mock Data */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                                <p className="font-semibold">CS101: Intro to Computer Science</p>
                                <p className="text-xs text-white/40">Uploaded 2 days ago • 1.2MB</p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">Analyzed</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                                <p className="font-semibold">ECON202: Macroeconomics</p>
                                <p className="text-xs text-white/40">Uploaded 5 days ago • 3.4MB</p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">Analyzed</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
