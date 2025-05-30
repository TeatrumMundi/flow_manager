import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FlowManager – Zarządzanie projektami i personelem",
    description:
        "FlowManager to nowoczesna aplikacja do kompleksowego zarządzania projektami, czasem pracy oraz zasobami ludzkimi.",
        icons: {
            icon: "/flowicon.png",
        }
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
