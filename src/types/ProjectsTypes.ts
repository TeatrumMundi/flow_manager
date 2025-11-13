import type { UserListItem } from "@/dataBase/query/users/listUsersFromDb";

export interface Project {
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

export interface ProjectsViewProps {
  initialProjects: Project[];
  projectsData: Array<{
    id: number;
    name: string | null;
    description: string | null;
    budget: string | null;
    progress: number | null;
    startDate: string | null;
    endDate: string | null;
    isArchived: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
  }>;
  availableStatuses: string[];
  allUsers: UserListItem[];
}
