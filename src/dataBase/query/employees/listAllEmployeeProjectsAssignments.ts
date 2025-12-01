import { eq } from "drizzle-orm";
import { projectAssignments, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface AllEmployeeProjectAssignments {
  userId: number;
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
 * Lists all project assignments for all employees in a single query.
 * This is much more efficient than calling listEmployeeProjectsAssignments for each employee.
 *
 * @returns Array of all project assignments with project details
 *
 * @example
 * ```ts
 * const allAssignments = await listAllEmployeeProjectsAssignments();
 * const employeeProjectsMap = new Map();
 * for (const assignment of allAssignments) {
 *   if (!employeeProjectsMap.has(assignment.userId)) {
 *     employeeProjectsMap.set(assignment.userId, []);
 *   }
 *   employeeProjectsMap.get(assignment.userId).push(assignment);
 * }
 * ```
 */
export async function listAllEmployeeProjectsAssignments(): Promise<
  AllEmployeeProjectAssignments[]
> {
  const result = await database
    .select({
      userId: projectAssignments.userId,
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
    .orderBy(projectAssignments.userId, projectAssignments.assignedAt);

  return result;
}
