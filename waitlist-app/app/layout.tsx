import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAVLOS Waitlist - AI Study Partner for Students",
  description: "Join the waitlist for STAVLOS, an AI study partner built by a student, for students. €8/mo. Early birds get special pricing!",
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
