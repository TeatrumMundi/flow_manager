"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { GoSignOut } from "react-icons/go";
import { useTimeAndDate } from "@/hooks/useTimeAndDate";

interface TopBarProps {
  userName: string;
}

export function TopBar({ userName }: TopBarProps) {
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
        <span className="text-gray-700 font-medium">{userName}</span>
        <span className="text-gray-500">{time}</span>
        <span className="text-gray-500">{date}</span>
        <button
          type="button"
          onClick={() => {
            const logoutPromise = signOut({ redirect: false }).then(() => {
              setTimeout(() => {
                window.location.href = "/";
              }, 1000);
            });

            toast.promise(logoutPromise, {
              loading: "Wylogowywanie...",
              success: "Pomyślnie wylogowano!",
              error: "Błąd podczas wylogowywania.",
            });
          }}
          className="bg-red-500 font-medium px-2 py-1 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-500 hover:scale-105"
        >
          Wyloguj
          <GoSignOut className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
}
