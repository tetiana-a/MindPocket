import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata = {
  title: 'MindPocket — Created by Tetiana Kotolup',
  description: 'Created by Tetiana Kotolup',

  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-black text-white font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
