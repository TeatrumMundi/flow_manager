import { auth } from "@/auth";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { listProjectsByUserFromDb } from "@/dataBase/query/projects/listProjectsByUserFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listUsersFromDb } from "@/dataBase/query/users/listUsersFromDb";
import { mapProjectData } from "@/utils/mapProjectData";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const session = await auth();
  const userProfile = session?.user?.email
    ? await getFullUserProfileFromDbByEmail(session.user.email)
    : null;

  // Check if user has admin/management privileges (can see all projects)
  const privilegedRoles = ["Administrator", "Zarząd"];
  const hasFullAccess = userProfile?.role?.name
    ? privilegedRoles.includes(userProfile.role.name)
    : false;

  // Fetch projects based on user role
  const projectsData =
    hasFullAccess || !userProfile?.id
      ? await listProjectsFromDb()
      : await listProjectsByUserFromDb(userProfile.id);

  const allUsers = await listUsersFromDb();

  const projects = mapProjectData(projectsData);

  const availableStatuses = [
    "Aktywny",
    "Zarchiwizowany",
    "Wstrzymany",
    "Zakończony",
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile
            title={hasFullAccess ? "Projekty" : "Moje projekty"}
          />
        </div>

        <ProjectsView
          initialProjects={projects}
          projectsData={projectsData}
          availableStatuses={availableStatuses}
          allUsers={allUsers}
          hasFullAccess={hasFullAccess}
          currentUserId={userProfile?.id}
        />
      </main>
    </div>
  );
}
