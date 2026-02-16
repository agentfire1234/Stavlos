import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: "STAVLOS - Master Your Studies with AI",
  description: "The AI study partner that knows your syllabus. Stop staring, start mastering.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stavlos",
  },
};

import { MobileNav } from '@/components/layout/mobile-nav'
import { CommandBar } from '@/components/layout/command-bar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        {/* Umami Analytics - Privacy-First & Zero Cookies */}
        <script
          async
          defer
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          src="https://cloud.umami.is/script.js"
        />
      </head>
      <body
        className="antialiased bg-black text-white selection:bg-blue-500 selection:text-white font-sans pb-24 md:pb-0"
        suppressHydrationWarning
      >
        {children}
        <CommandBar />
        <MobileNav />

        {/* PWA & IRON DOME INFRA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }

              // Push Notification Request (Iron Dome)
              if ('Notification' in window && Notification.permission === 'default') {
                setTimeout(() => {
                  Notification.requestPermission();
                }, 10000); // Wait 10s to not disrupt UX
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
