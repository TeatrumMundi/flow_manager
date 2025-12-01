import { eq } from "drizzle-orm";
import { tasks, projects, users, userProfiles } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface TaskDetail {
  id: number;
  projectId: number | null;
  projectName: string | null;
  projectStatus: string | null;
  title: string | null;
  description: string | null;
  assignedToId: number | null;
  assignedToName: string | null;
  assignedToEmail: string | null;
  status: string | null;
  estimatedHours: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Gets detailed information about a specific task by ID.
 *
 * @param taskId - ID of the task to retrieve
 * @returns Task details with project and assignee information
 * @throws Error if task not found
 *
 * @example
 * ```ts
 * const task = await getTaskByIdFromDb(10);
 * console.log(`Task: ${task.title} in project ${task.projectName}`);
 * ```
 */
export async function getTaskByIdFromDb(
  taskId: number,
): Promise<TaskDetail | null> {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
      projectName: projects.name,
      projectStatus: projects.status,
      title: tasks.title,
      description: tasks.description,
      assignedToId: tasks.assignedToId,
      assignedToName: userProfiles.firstName,
      assignedToLastName: userProfiles.lastName,
      assignedToEmail: users.email,
      status: tasks.status,
      estimatedHours: tasks.estimatedHours,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assignedToId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(tasks.id, taskId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const task = result[0];

  return {
    id: task.id,
    projectId: task.projectId,
    projectName: task.projectName,
    projectStatus: task.projectStatus,
    title: task.title,
    description: task.description,
    assignedToId: task.assignedToId,
    assignedToName:
      task.assignedToName && task.assignedToLastName
        ? `${task.assignedToName} ${task.assignedToLastName}`
        : null,
    assignedToEmail: task.assignedToEmail,
    status: task.status,
    estimatedHours: task.estimatedHours,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
