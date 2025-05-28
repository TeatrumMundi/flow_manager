import Image from "next/image";
import Link from "next/link";
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

export default function UserDashboard() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Background image */}
      <Image
        src="/loginBG.png"
        alt="Background"
        fill
        priority
        className="object-cover z-[-1]"
        quality={100}
      />

      {/* Top bar */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl shadow-md px-8 py-3 mt-10 mb-25 gap-2">
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
          <span className="text-gray-700 font-medium">Jan Kowalski</span>
          <span className="text-gray-500">{new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-gray-500">{new Date().toLocaleDateString('pl-PL', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          <button className="text-blue-600 hover:underline font-medium">Wyloguj</button>
        </div>
      </div>

      {/* Tiles grid */}
      <div className="flex flex-1 items-start justify-center w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8 w-48 h-48 hover:bg-blue-50 transition cursor-pointer"
            >
              {tile.icon}
              <span className="mt-4 text-lg font-semibold text-gray-700 text-center">{tile.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}