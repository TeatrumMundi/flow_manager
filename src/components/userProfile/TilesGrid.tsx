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
import { Tile } from "@/components/userProfile/Tile";
import useUserStore from "@/store/userStore";
import type { menuTile } from "@/types/interfaces";

const menuTiles: menuTile[] = [
  {
    icon: <FaUsers size={40} className="text-blue-500" />,
    label: "Użytkownicy",
    href: "/users",
    accessibleByRoles: ["Administrator"],
  },
  {
    icon: <FaClock size={40} className="text-blue-500" />,
    label: "Czas pracy",
    href: "/work-time",
    accessibleByRoles: [
      "Administrator",
      "Zarząd",
      "HR",
      "Księgowość",
      "Użytkownik",
    ],
  },
  {
    icon: <FaProjectDiagram size={40} className="text-blue-500" />,
    label: "Projekty",
    href: "/projects",
    accessibleByRoles: ["Administrator", "Zarząd", "Użytkownik"],
  },
  {
    icon: <FaCalendarCheck size={40} className="text-blue-500" />,
    label: "Urlopy",
    href: "/vacations",
    accessibleByRoles: [
      "Administrator",
      "Zarząd",
      "HR",
      "Księgowość",
      "Użytkownik",
    ],
  },
  {
    icon: <FaChartBar size={40} className="text-blue-500" />,
    label: "Raporty",
    href: "/reports",
    accessibleByRoles: ["Administrator", "Zarząd", "HR", "Księgowość"],
  },
  {
    icon: <FaDollarSign size={40} className="text-blue-500" />,
    label: "Wydatki",
    href: "/expenses",
    accessibleByRoles: ["Administrator", "Zarząd", "Księgowość"],
  },
  {
    icon: <FaChartPie size={40} className="text-blue-500" />,
    label: "Finanse",
    href: "/finances",
    accessibleByRoles: ["Administrator", "Zarząd", "Księgowość"],
  },
  {
    icon: <FaUser size={40} className="text-blue-500" />,
    label: "Pracownicy",
    href: "/employees",
    accessibleByRoles: [
      "Administrator",
      "Zarząd",
      "HR",
      "Księgowość",
      "Użytkownik",
    ],
  },
];

export function TilesGrid() {
  const userProfile = useUserStore((state) => state.userProfile);
  const userRole = userProfile?.role?.name || "Użytkownik";

  // Check if user has admin privileges
  const privilegedRoles = ["Administrator", "Zarząd", "HR", "Księgowość"];
  const hasAdminPrivileges = privilegedRoles.includes(userRole);

  const accessibleTiles = menuTiles.filter(
    (tile) => tile.accessibleByRoles?.includes(userRole) ?? false,
  );

  return (
    <div className="flex flex-1 items-start justify-center w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {accessibleTiles.map((tile) => (
          <Tile
            key={tile.label}
            icon={tile.icon}
            label={
              tile.href === "/employees" && !hasAdminPrivileges
                ? "Mój profil"
                : tile.label
            }
            href={tile.href}
          />
        ))}
      </div>
    </div>
  );
}
