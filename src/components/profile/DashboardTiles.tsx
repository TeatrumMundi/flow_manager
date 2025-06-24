"use client";

import { motion } from "framer-motion";
import { FaUsers, FaClock, FaProjectDiagram, FaCalendarCheck, FaChartBar, FaDollarSign, FaChartPie, FaUser } from "react-icons/fa";

const tiles = [
  { icon: <FaUsers size={40} className="text-blue-500" />, label: "Użytkownicy" },
  { icon: <FaClock size={40} className="text-blue-500" />, label: "Czas pracy" },
  { icon: <FaProjectDiagram size={40} className="text-blue-500" />, label: "Projekty" },
  { icon: <FaCalendarCheck size={40} className="text-blue-500" />, label: "Urlopy" },
  { icon: <FaChartBar size={40} className="text-blue-500" />, label: "Raporty" },
  { icon: <FaDollarSign size={40} className="text-blue-500" />, label: "Wydatki" },
  { icon: <FaChartPie size={40} className="text-blue-500" />, label: "Finanse" },
  { icon: <FaUser size={40} className="text-blue-500" />, label: "Pracownicy" },
];

interface DashboardTilesProps {
  isLoggingOut: boolean;
}

export default function DashboardTiles({ isLoggingOut }: DashboardTilesProps) {
  return (
    <motion.div 
      className="flex flex-1 items-start justify-center w-full"
      animate={{ 
        opacity: isLoggingOut ? 0.3 : 1,
        scale: isLoggingOut ? 0.95 : 1 
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-2xl shadow-[0_0_24px_4px_rgba(0,100,200,0.1)] p-8 w-48 h-48 hover:bg-blue-50 transition cursor-pointer"
          >
            {tile.icon}
            <span className="mt-4 text-lg font-semibold text-gray-700 text-center">{tile.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}