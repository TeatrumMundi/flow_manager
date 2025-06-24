"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopBarProps {
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
  };
  time: string;
  date: string;
  isLoggingOut: boolean;
  onLogout: () => void;
}

interface LogoutButtonProps {
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function TopBar({ user, time, date, isLoggingOut, onLogout }: TopBarProps) {
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
        <span className="text-2xl font-semibold text-gray-700 tracking-tight">FlowManager</span>
      </div>
      <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 w-full md:w-auto justify-end">
        {/* User Info Tile */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-[0_0_12px_2px_rgba(0,100,200,0.1)] px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700 font-medium text-sm">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

        {/* Time Tile */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-[0_0_12px_2px_rgba(0,100,200,0.1)] px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600 font-medium text-sm">{time}</span>
          </div>
        </div>

        {/* Date Tile */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-[0_0_12px_2px_rgba(0,100,200,0.1)] px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-600 font-medium text-sm">{date}</span>
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton isLoggingOut={isLoggingOut} onLogout={onLogout} />
      </div>
    </div>
  );
}

function LogoutButton({ isLoggingOut, onLogout }: LogoutButtonProps) {
  return (
    <motion.button
      onClick={onLogout}
      className="bg-gradient-to-r from-blue-600/40 to-blue-700/40 backdrop-blur-md rounded-xl shadow-[0_0_12px_2px_rgba(59,130,246,0.3)] px-6 py-2.5 text-white font-semibold relative overflow-hidden hover:from-blue-600/50 hover:to-blue-700/50 hover:shadow-[0_0_16px_4px_rgba(59,130,246,0.4)] transition-all duration-200 border border-blue-400/30 min-w-[140px]"
      animate={{
        backgroundColor: isLoggingOut ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.4)",
      }}
      whileHover={!isLoggingOut ? { y: -1 } : {}}
      whileTap={!isLoggingOut ? { y: 0 } : {}}
      disabled={isLoggingOut}
    >
      <motion.div
        className="flex items-center gap-2 justify-center"
        animate={{
          opacity: isLoggingOut ? 0 : 1,
          x: isLoggingOut ? -20 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="text-sm">Wyloguj</span>
      </motion.div>

      {/* Loading State */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: isLoggingOut ? 1 : 0,
          x: isLoggingOut ? 0 : 20,
        }}
        transition={{ duration: 0.3, delay: isLoggingOut ? 0.2 : 0 }}
      >
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-sm font-medium">Wylogowywanie...</span>
      </motion.div>
    </motion.button>
  );
}