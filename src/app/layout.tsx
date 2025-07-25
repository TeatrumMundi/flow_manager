import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";
import React from "react";
import BackgroundImage from "@/components/common/BackgroundImage";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowManager – Zarządzanie projektami i personelem",
  description:
    "FlowManager to nowoczesna aplikacja do kompleksowego zarządzania projektami, czasem pracy oraz zasobami ludzkimi.",
  icons: {
    icon: "/flowIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased relative`}>
        <BackgroundImage />
        {children}
      </body>
    </html>
  );
}
