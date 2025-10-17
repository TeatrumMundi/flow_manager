import type React from "react";
import Link from "next/link";

interface TileProps {
    icon: React.ReactNode;
    label: string;
    href: string;
}

export function Tile({ icon, label, href }: TileProps) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-2xl shadow-[0_0_24px_4px_rgba(0,100,200,0.1)] p-8 w-48 h-48 hover:bg-blue-50 transition cursor-pointer">
            {icon}
            <span className="mt-4 text-lg font-semibold text-gray-700 text-center">
        {label}
      </span>
        </Link>
    );
}

