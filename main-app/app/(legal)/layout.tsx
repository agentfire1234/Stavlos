import { LandingNav } from "@/components/layout/landing-nav"
import { LandingFooter } from "@/components/layout/landing-footer"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#0a0a0f] min-h-screen flex flex-col -ml-0 md:-ml-60 pt-16 font-dm-sans text-white">
            <LandingNav />
            {/* Root Layout Sidebar is present but we override it visually with -ml-0 md:-ml-60 and z-indexes if needed 
        Alternatively, root layout's sidebar is still there. Wait, the main landing page applied `-ml-0 md:-ml-60` to 
        the top level container to jump over the sidebar. We'll do the same. 
      */}
            <main className="flex-1 w-full relative">
                {children}
            </main>
            <LandingFooter />
        </div>
    )
}
