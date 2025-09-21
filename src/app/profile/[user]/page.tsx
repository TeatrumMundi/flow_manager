"use client";

import Image from "next/image";
import { Tile } from "@/Components/Tile";
import Link from "next/link";
import { useTimeAndDate } from "@/hooks/useTimeAndDate";
import {
  FaCalendarCheck,
  FaChartBar,
  FaChartPie,
  FaClock,
  FaDollarSign,
  FaProjectDiagram,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { signOutAction } from "@/app/actions/signOutAction";

const tiles = [
  {
    icon: <FaUsers size={40} className="text-blue-500" />,
    label: "Użytkownicy",
  },
  {
    icon: <FaClock size={40} className="text-blue-500" />,
    label: "Czas pracy",
  },
  {
    icon: <FaProjectDiagram size={40} className="text-blue-500" />,
    label: "Projekty",
  },
  {
    icon: <FaCalendarCheck size={40} className="text-blue-500" />,
    label: "Urlopy",
  },
  {
    icon: <FaChartBar size={40} className="text-blue-500" />,
    label: "Raporty",
  },
  {
    icon: <FaDollarSign size={40} className="text-blue-500" />,
    label: "Wydatki",
  },
  {
    icon: <FaChartPie size={40} className="text-blue-500" />,
    label: "Finanse",
  },
  { icon: <FaUser size={40} className="text-blue-500" />, label: "Pracownicy" },
];

export default function UserDashboard() {
  const { time, date } = useTimeAndDate();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Top bar */}
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
          <span className="text-gray-700 font-medium">Jan Kowalski</span>
          <span className="text-gray-500">{time}</span>
          <span className="text-gray-500">{date}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-blue-600 hover:underline font-medium"
            >
              Wyloguj
            </button>
          </form>
        </div>
      </div>

      {/* Tiles grid */}
      <div className="flex flex-1 items-start justify-center w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {tiles.map((tile) => (
            <Tile key={tile.label} icon={tile.icon} label={tile.label} />
          ))}
        </div>
      </div>
    </main>
  );
}
