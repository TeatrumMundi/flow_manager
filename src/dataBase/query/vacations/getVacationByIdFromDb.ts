import { eq } from "drizzle-orm";
import { vacations, vacationTypes } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface VacationDetails {
  id: number;
  userId: number | null;
  startDate: string | null;
  endDate: string | null;
  typeId: number | null;
  typeName: string | null;
  statusId: number | null;
}

/**
 * Gets a single vacation by ID with type information.
 *
 * @param vacationId - The vacation ID to fetch
 * @returns Promise<VacationDetails | null> - Vacation details or null if not found
 */
export async function getVacationByIdFromDb(
  vacationId: number,
): Promise<VacationDetails | null> {
  const result = await database
    .select({
      id: vacations.id,
      userId: vacations.userId,
      startDate: vacations.startDate,
      endDate: vacations.endDate,
      typeId: vacations.typeId,
      typeName: vacationTypes.name,
      statusId: vacations.statusId,
    })
    .from(vacations)
    .leftJoin(vacationTypes, eq(vacations.typeId, vacationTypes.id))
    .where(eq(vacations.id, vacationId))
    .limit(1);

  return result[0] || null;
}
