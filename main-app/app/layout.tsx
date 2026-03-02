import type { Metadata } from "next";
import { Syne, DM_Sans } from 'next/font/google'
import "./globals.css";
import { CommandBar } from "@/components/layout/command-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'react-hot-toast'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne'
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  title: "STAVLOS - AI Study Partner",
  description: "Stop searching. Start knowing.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stavlos",
  },
  icons: {
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-body bg-[#0a0a0f] text-white">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 ml-0 md:ml-60 pb-20 md:pb-0">
            {children}
          </main>
        </div>

        <CommandBar />
        <MobileNav />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'glass-card text-white border-white/10 backdrop-blur-xl',
            duration: 4000,
          }}
        />
        <Analytics />
        <SpeedInsights />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(console.error);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
