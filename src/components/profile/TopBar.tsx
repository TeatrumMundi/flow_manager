"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopBarProps {
  user: {
    firstName?: string;
    lastName?: string;
  };
  time: string;
  date: string;
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
      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-1 md:space-y-0 w-full md:w-auto justify-end">
        <span className="text-gray-700 font-medium">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-gray-500">{time}</span>
        <span className="text-gray-500">{date}</span>
        <motion.button 
          onClick={onLogout}
          className="text-blue-600 hover:underline font-medium relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoggingOut}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoggingOut ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            Wyloguj
          </motion.span>
          {isLoggingOut && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
}