"use client";

import Link from "next/link";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  manager?: string;
  progress: number;
  budget: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface ProjectDetailsViewProps {
  project: Project;
  allUsers: UserListItem[];
  onBack: () => void;
}

const mockTasks = [
  {
    id: 1,
    name: "Design Review",
    worker: "Piotr Wiśniewski",
    status: "Aktywny",
    hours: 40,
  },
  {
    id: 2,
    name: "Backend development",
    worker: "Jan Kowalski",
    status: "W toku",
    hours: 150,
  },
  {
    id: 3,
    name: "Frontend development",
    worker: "Marek Lewandowski",
    status: "Zakończony",
    hours: 250,
  },
  {
    id: 4,
    name: "Final Testing",
    worker: "Katarzyna Wójcik",
    status: "Zakończony",
    hours: 80,
  },
];

export function ProjectDetailsView({
  project,
  allUsers,
  onBack,
}: ProjectDetailsViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Powrót do projektów
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Szczegóły projektu: {project.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Zadania
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600">Nazwa</th>
                    <th className="p-3 font-semibold text-gray-600">
                      Przypisany pracownik
                    </th>
                    <th className="p-3 font-semibold text-gray-600">Status</th>
                    <th className="p-3 font-semibold text-gray-600">Godziny</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 hover:bg-gray-50/50"
                    >
                      <td className="p-3 text-gray-800 font-medium">
                        {task.name}
                      </td>
                      <td className="p-3 text-gray-700">{task.worker}</td>
                      <td className="p-3">
                        <ProjectStatusBadge status={task.status} />
                      </td>
                      <td className="p-3 text-gray-700">{task.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Przypisani pracownicy
            </h2>
            <div className="max-h-60 overflow-y-auto pr-2">
              <ul className="space-y-2">
                {allUsers.slice(0, 5).map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({user.email})
                      </span>
                    </div>
                    <Button variant="secondary" className="py-1 px-3 text-sm">
                      Zarządzaj
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="primary" className="mt-4">
              <FaUserPlus className="mr-2" />
              Zarządzaj przypisaniem
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/50 rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Koszt projektu
            </h3>
            <p className="text-sm text-gray-500 mb-3">(Czas pracy + wydatki)</p>
            <p className="text-4xl font-bold text-gray-800">$90 000</p>
          </div>
          <div className="bg-white/50 rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Rentowność projektu
            </h3>
            <p className="text-4xl font-bold text-gray-800">23 %</p>
            <p className="text-sm text-gray-500 mt-3">Pole do uzupełnienia</p>
          </div>
          <div className="bg-white/50 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Załączniki
            </h3>
            <div className="space-y-2">
              <Link href="#" className="text-blue-600 hover:underline block">
                Brief
              </Link>
              <Link href="#" className="text-blue-600 hover:underline block">
                Dokumentacja
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-3">Pole do uzupełnienia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
