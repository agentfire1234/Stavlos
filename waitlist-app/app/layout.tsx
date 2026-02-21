import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// BUG 002 FIX: Added full OpenGraph metadata so the link preview looks great
// when shared on X, Discord, WhatsApp, etc.
// Helper to ensure URL has a protocol
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_URL || 'https://waitlist.stavlos.com';
  return url.startsWith('http') ? url : `https://${url}`;
};

export const metadata: Metadata = {
  title: "STAVLOS — AI Study Partner for Students",
  description: "Upload your syllabus. Get an AI that knows exactly what's on your exam. Built by a student, for students. €8/mo. Join the waitlist.",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    title: "STAVLOS — AI Study Partner for Students",
    description: "Upload your syllabus. Ask 'What's on my exam?' Get perfect answers. Join the waitlist.",
    url: getBaseUrl(),
    siteName: "Stavlos",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stavlos — The AI Study Partner",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAVLOS — AI Study Partner for Students",
    description: "Built by a student, for students. €8/mo. Join the waitlist.",
    images: ["/og-image.png"],
    creator: "@stavlos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
