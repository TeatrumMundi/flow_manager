import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { listUsersFromDb } from "@/dataBase/query/listUsersFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";
import { mapProjectData } from "@/utils/mapProjectData";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projectsData = await listProjectsFromDb({ isArchived: false });
  const allUsers = await listUsersFromDb();

  const projects = mapProjectData(projectsData);

  const availableStatuses = [
    "Aktywny",
    "Zarchiwizowany",
    "Wstrzymany",
    "Zakończony",
  ];

  // Get all users as potential managers
  const availableManagers = allUsers
    .filter((user) => user.firstName && user.lastName)
    .map((user) => `${user.firstName} ${user.lastName}`)
    .sort();

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Projekty" />
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
