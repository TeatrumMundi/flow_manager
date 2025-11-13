import type { ProjectListItem } from "@/dataBase/query/projects/listProjectsFromDb";
import type { Project } from "@/types/ProjectsTypes";

export function mapProjectData(projectsData: ProjectListItem[]): Project[] {
  return projectsData.map((project) => {
    const managerName =
      project.managerFirstName && project.managerLastName
        ? `${project.managerFirstName} ${project.managerLastName}`
        : undefined;

    return {
      id: project.id,
      name: project.name || "Unnamed Project",
      description: project.description,
      status:
        project.status || (project.isArchived ? "Zarchiwizowany" : "Aktywny"),
      manager: managerName,
      progress: project.progress || 0,
      budget: project.budget ? Number(project.budget) : 0,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });
}
