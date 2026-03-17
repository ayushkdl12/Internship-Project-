import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Internship Provision System - Nepal",
  description: "Connect with internship opportunities in Nepal. Students, Organizations, and Colleges can collaborate for meaningful internship experiences.",
  keywords: ["Internship", "Nepal", "Students", "Organizations", "Colleges", "Career"],
  authors: [{ name: "National College of Engineering" }],
  icons: {
    icon: [
      { url: "/logo.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg?v=2",
    apple: "/logo.svg?v=2",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Internship Provision System - Nepal",
    description: "Connect with internship opportunities in Nepal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
