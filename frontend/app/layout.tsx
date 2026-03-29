import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OfflineIndicator from "@/components/OfflineIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rural Health AI | Professional Protocol",
  description: "Advanced AI-Powered Rural Healthcare Solutions with Offline Resilience.",
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
