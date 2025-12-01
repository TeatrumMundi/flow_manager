import { notFound } from "next/navigation";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ProjectDetailsView } from "@/components/projects/ProjectDetailsView";
import { getProjectByNameFromDb } from "@/dataBase/query/projects/getProjectByNameFromDb";
import { listUsersFromDb } from "@/dataBase/query/users/listUsersFromDb";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    projectName: string;
  }>;
};

export default async function ProjectDetailsPage({ params }: Props) {
  const { projectName } = await params;

  const project = await getProjectByNameFromDb(projectName);

  if (!project) {
    notFound();
  }

  const allUsers = await listUsersFromDb();

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackToDashboardButton href="/projects">
              Powrót do projektów
            </BackToDashboardButton>
          </div>
          <SectionTitleTile title={`Projekt: ${project.name}`} />
        </div>

        <ProjectDetailsView
          project={{
            id: project.id,
            name: project.name || "",
            description: project.description || "",
            status: project.status || "",
            budget: Number(project.budget) || 0,
            progress: project.progress || 0,
            startDate: project.startDate || "",
            endDate: project.endDate || "",
          }}
          allUsers={allUsers}
          onBack={null}
        />
      </main>
    </div>
  );
}
