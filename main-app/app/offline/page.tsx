export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <span className="text-4xl">📡</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight italic">You're Offline</h1>
                    <p className="text-white/40 font-medium max-w-xs mx-auto">
                        Stavlos needs an internet connection to reach our AI models. Check your signal.
                    </p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all"
                    >
                        Try Reconnecting
                    </button>
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 pt-12">
                    Stavlos OS • Disconnected
                </p>
            </div>
        </div>
    )
}
