import type { Metadata } from "next";
import "./globals.css";

// BUG 002 FIX: Added full OpenGraph metadata so the link preview looks great
// when shared on X, Discord, WhatsApp, etc.
export const metadata: Metadata = {
  title: "STAVLOS — AI Study Partner for Students",
  description: "Upload your syllabus. Get an AI that knows exactly what's on your exam. Built by a student, for students. €8/mo. Join 12,000+ on the waitlist.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://waitlist.stavlos.com'),
  openGraph: {
    title: "STAVLOS — AI Study Partner for Students",
    description: "Upload your syllabus. Ask 'What's on my exam?' Get perfect answers. Join 12,000+ students on the waitlist.",
    url: process.env.NEXT_PUBLIC_URL || 'https://waitlist.stavlos.com',
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
    description: "Built by a student, for students. €8/mo. Join 12,000+ on the waitlist.",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
