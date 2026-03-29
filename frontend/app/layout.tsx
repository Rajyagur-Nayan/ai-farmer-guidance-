import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OfflineIndicator from "@/components/OfflineIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Farmer AI | Professional Agriculture Hub",
  description: "Advanced AI-Powered Agricultural Intelligence for Modern Farming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black min-h-screen antialiased selection:bg-black selection:text-white`}>
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
