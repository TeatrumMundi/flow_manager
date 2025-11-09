import toast from "react-hot-toast";
import type { Project } from "@/types/ProjectsTypes";

export function useDeleteProject() {
  const deleteProject = async (project: Project) => {
    if (!project?.id) throw new Error("Project ID is required");
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Błąd podczas usuwania projektu");
      }
      toast.success(`Usunięto projekt: ${project.name || project.id}`);
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Błąd podczas usuwania projektu",
      );
      throw error;
    }
  };

  return { deleteProject };
}
