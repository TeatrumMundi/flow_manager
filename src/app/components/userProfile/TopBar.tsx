"use client";

import Image from "next/image";
import Link from "next/link";
import { useTimeAndDate } from "@/hooks/useTimeAndDate";
import LogoutButton from "@/app/components/LogoutButton";

interface TopBarProps {
  userName: string;
  userRole?: string | null;
}

export function TopBar({ userName, userRole }: TopBarProps) {
  const { time, date } = useTimeAndDate();

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl shadow-[0_0_24px_4px_rgba(0,100,200,0.1)] px-8 py-3 mt-10 mb-25 gap-2">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/flowIcon.png"
            alt="Flow Manager Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
        <span className="text-2xl font-semibold text-gray-700 tracking-tight">
          FlowManager
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-1 md:space-y-0 w-full md:w-auto justify-end">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">{userName}</span>
          {userRole && (
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {userRole}
            </span>
          )}
        </div>
        <span className="text-gray-500">{time}</span>
        <span className="text-gray-500">{date}</span>
        <LogoutButton 
          className="bg-red-500/80 backdrop-blur-2xl font-medium px-2 py-1 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-500 hover:scale-105 text-white flex items-center gap-2"
          fullWidth={false}
        />
      </div>
    </div>
  );
}
