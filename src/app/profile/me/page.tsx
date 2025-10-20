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
import getFullUserProfileFromDbByEmail from "@/dataBase/query/getFullUserProfileFromDbByEmail";

const tiles = [
  {
    icon: <FaUsers size={40} className="text-blue-500" />,
    label: "Użytkownicy",
    href: "/users",
  },
  {
    icon: <FaClock size={40} className="text-blue-500" />,
    label: "Czas pracy",
    href: "#",
  },
  {
    icon: <FaProjectDiagram size={40} className="text-blue-500" />,
    label: "Projekty",
    href: "#",
  },
  {
    icon: <FaCalendarCheck size={40} className="text-blue-500" />,
    label: "Urlopy",
    href: "#",
  },
  {
    icon: <FaChartBar size={40} className="text-blue-500" />,
    label: "Raporty",
    href: "#",
  },
  {
    icon: <FaDollarSign size={40} className="text-blue-500" />,
    label: "Wydatki",
    href: "#",
  },
  {
    icon: <FaChartPie size={40} className="text-blue-500" />,
    label: "Finanse",
    href: "#",
  },
  {
    icon: <FaUser size={40} className="text-blue-500" />,
    label: "Pracownicy",
    href: "#",
  },
];

export default async function UserDashboard() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const userProfile = await getFullUserProfileFromDbByEmail(session.user.email);

  const displayName = userProfile?.profile?.firstName && userProfile?.profile?.lastName
    ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
    : userProfile?.email ?? "Unknown";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <TopBar userName={displayName} userRole={userProfile?.role?.name} />
      {/* Tiles grid */}
      <div className="flex flex-1 items-start justify-center w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {tiles.map((tile) => (
            <Tile
              key={tile.label}
              icon={tile.icon}
              label={tile.label}
              href={tile.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
