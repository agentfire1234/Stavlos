import type { Metadata } from "next";
import { Syne, DM_Sans } from 'next/font/google'
import "./globals.css";
import { CommandBar } from "@/components/layout/command-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import Script from 'next/script'
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
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="33970a75-02a0-4b85-9078-e9b876bd6ba2"
          strategy="afterInteractive"
        />
        <Script
          id="service-worker"
          strategy="afterInteractive"
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
