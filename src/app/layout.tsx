import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "MindPocket — Psycholog ve vaší kapse",
  description: "AI psycholog, deník nálad, dechová cvičení a krizová podpora. Vše na jednom místě.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
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
