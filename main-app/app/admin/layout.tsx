import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Logo size={22} className="text-teal-400" href="/dashboard" />
                        <Link href="/dashboard" className="text-xl font-black tracking-tighter hover:opacity-80 transition">
                            STAVLOS <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded ml-1 tracking-widest">ADMIN</span>
                        </Link>
                    </div>
                    <nav className="flex gap-6 text-sm font-bold text-white/40">
                        <Link href="/admin" className="hover:text-white transition">Overview</Link>
                        <Link href="/admin/users" className="hover:text-white transition">Users</Link>
                        <Link href="/admin/finances" className="hover:text-white transition">Finances</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Environment</p>
                        <p className="text-xs font-bold text-green-400">Production</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
