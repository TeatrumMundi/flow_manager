import { eq } from "drizzle-orm";
import { projectAssignments, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface EmployeeProjectAssignmentListItem {
  assignmentId: number;
  projectId: number;
  projectName: string | null;
  projectDescription: string | null;
  projectStatus: string | null;
  projectProgress: number | null;
  projectStartDate: string | null;
  projectEndDate: string | null;
  roleOnProject: string | null;
  assignedAt: string | null;
}

/**
 * Lists all projects assigned to a specific employee with project details.
 *
 * @param userId - The ID of the employee/user
 * @returns Array of projects the employee is assigned to
 *
 * @example
 * ```ts
 * const employeeProjects = await listEmployeeProjectsAssignments(5);
 * console.log(`Employee is assigned to ${employeeProjects.length} projects`);
 * ```
 */
export async function listEmployeeProjectsAssignments(
  userId: number,
): Promise<EmployeeProjectAssignmentListItem[]> {
  const result = await database
    .select({
      assignmentId: projectAssignments.id,
      projectId: projects.id,
      projectName: projects.name,
      projectDescription: projects.description,
      projectStatus: projects.status,
      projectProgress: projects.progress,
      projectStartDate: projects.startDate,
      projectEndDate: projects.endDate,
      roleOnProject: projectAssignments.roleOnProject,
      assignedAt: projectAssignments.assignedAt,
    })
    .from(projectAssignments)
    .innerJoin(projects, eq(projectAssignments.projectId, projects.id))
    .where(eq(projectAssignments.userId, userId))
    .orderBy(projectAssignments.assignedAt);

  return result;
}
