import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ProManage System – Zarządzanie projektami i personelem",
    description:
        "ProManage to nowoczesna aplikacja do kompleksowego zarządzania projektami, czasem pracy oraz zasobami ludzkimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${inter.variable} antialiased`}>
            {children}
        </body>
    </html>
  );
}
