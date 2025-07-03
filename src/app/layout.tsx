import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientBody from "./ClientBody";
import { WalletProvider } from "@/contexts/WalletContext";
import { AppKitProvider } from "@/contexts/AppKitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BSC Pool - DeFi Mining Platform",
  description: "安全、高效、透明的去中心化挖矿平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AppKitProvider>
          <WalletProvider>
            <ClientBody>{children}</ClientBody>
          </WalletProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
