"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/profile/TopBar";
import DashboardTiles from "@/components/profile/DashboardTiles";
import BackgroundImage from "@/components/common/BackgroundImage";

export default function UserDashboard() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      router.push('/');
    }

    function updateTime() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("pl-PL", { month: "short", day: "2-digit", year: "numeric" }));
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.main 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8"
      >
        <BackgroundImage />
        <TopBar 
          user={user}
          time={time}
          date={date}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
        />
        <DashboardTiles isLoggingOut={isLoggingOut} />
      </motion.main>
    </AnimatePresence>
  );
}