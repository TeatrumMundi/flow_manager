import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { ProjectsView } from "@/components/projects/ProjectsView";

const mockProjects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "Aktywny",
    manager: "Piotr Wiśniewski",
    progress: 75,
    budget: 15000,
  },
  {
    id: 2,
    name: "System implementation",
    status: "Zakończony",
    manager: "Anna Nowak",
    progress: 100,
    budget: 50000,
  },
  {
    id: 3,
    name: "Development",
    status: "W toku",
    manager: "Jan Kowalski",
    progress: 40,
    budget: 25000,
  },
  {
    id: 4,
    name: "HR Revamp",
    status: "Aktywny",
    manager: "Marek Lewandowski",
    progress: 60,
    budget: 10000,
  },
  {
    id: 5,
    name: "Mobile App",
    status: "Zarchiwizowany",
    manager: "Katarzyna Wójcik",
    progress: 100,
    budget: 75000,
  },
];

export default async function ProjectsPage() {
  const projects = mockProjects;

  const availableStatuses = Array.from(
    new Set(projects.map((p) => p.status).filter(Boolean)),
  );

  const availableManagers = Array.from(
    new Set(projects.map((p) => p.manager).filter(Boolean)),
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/profile/me"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Powrót do pulpitu
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Projekty</h1>
        </div>

        <ProjectsView
          initialProjects={projects}
          availableStatuses={availableStatuses}
          availableManagers={availableManagers}
        />
      </main>
    </div>
  );
}
