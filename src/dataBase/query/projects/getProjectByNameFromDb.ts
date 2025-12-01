import { eq } from "drizzle-orm";
import { database } from "@/utils/db";
import { projects } from "../../schema";

export async function getProjectByNameFromDb(projectName: string) {
  const decodedName = decodeURIComponent(projectName);

  const [project] = await database
    .select()
    .from(projects)
    .where(eq(projects.name, decodedName))
    .limit(1);

  return project;
}
