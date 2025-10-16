"use server";

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
import { Tile } from "@/app/components/Tile";
import { TopBar } from "@/app/components/userProfile/TopBar";
import { auth } from "@/auth";

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

export default async function UserDashboard() {
  const session = await auth()
 
  if (!session?.user) return null
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <TopBar 
        userName={session.user.email ?? "Unknown"}
      />
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
