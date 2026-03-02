export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen p-6 md:p-8 pt-4">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    )
}
