import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAVLOS - Master Your Studies with AI",
  description: "The AI study partner that knows your syllabus. Stop staring, start mastering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-black text-white selection:bg-blue-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
