import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";
import { listUsersFromDb } from "@/dataBase/query/listUsersFromDb";

export default async function ProjectsPage() {
  const projectsData = await listProjectsFromDb({ isArchived: false });
  const allUsers = await listUsersFromDb();

  const projects = projectsData.map((project) => {
    const managerName =
        project.managerFirstName && project.managerLastName
            ? `${project.managerFirstName} ${project.managerLastName}`
            : undefined;

    return {
      id: project.id,
      name: project.name || "Unnamed Project",
      description: project.description,
      status: project.isArchived ? "Zarchiwizowany" : "Aktywny",
      manager: managerName,
      progress: project.progress || 0,
      budget: project.budget ? Number(project.budget) : 0,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });

  const availableStatuses = ["Aktywny", "Zarchiwizowany"];

  const availableManagers = Array.from(
      new Set(
          projectsData
              .map((project) =>
                  project.managerFirstName && project.managerLastName
                      ? `${project.managerFirstName} ${project.managerLastName}`
                      : null,
              )
              .filter((manager): manager is string => manager !== null),
      ),
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
              projectsData={projectsData}
              availableStatuses={availableStatuses}
              availableManagers={availableManagers}
              allUsers={allUsers}
          />
        </main>
      </div>
  );
}