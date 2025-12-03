import { NextResponse } from "next/server";
import { getVacationByIdFromDb } from "@/dataBase/query/vacations/getVacationByIdFromDb";
import { getVacationDaysInfoFromDb } from "@/dataBase/query/vacations/getVacationDaysInfoFromDb";
import { listVacationStatusesFromDb } from "@/dataBase/query/vacations/listVacationStatusesFromDb";
import { listVacationTypesFromDb } from "@/dataBase/query/vacations/listVacationTypesFromDb";
import { updateVacationDaysInDb } from "@/dataBase/query/vacations/updateVacationDaysInDb";
import { updateVacationInDb } from "@/dataBase/query/vacations/updateVacationInDb";

// Helper function to calculate business days (excluding weekends)
function calculateBusinessDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  if (start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const vacationId = Number(params.id);

    // Validate ID
    if (Number.isNaN(vacationId) || vacationId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid vacation ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { vacationType, status, startDate, endDate } = body;

    // Validate required fields
    if (!vacationType || !status || !startDate || !endDate) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Get vacation types and find the matching type ID
    const vacationTypes = await listVacationTypesFromDb();
    const typeRecord = vacationTypes.find((t) => t.name === vacationType);

    if (!typeRecord) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid vacation type",
        },
        { status: 400 },
      );
    }

    // Get vacation statuses and find the matching status ID
    const vacationStatuses = await listVacationStatusesFromDb();
    const statusRecord = vacationStatuses.find((s) => s.name === status);

    if (!statusRecord) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid vacation status",
        },
        { status: 400 },
      );
    }

    // Get current vacation to calculate the difference for balance updates
    const currentVacation = await getVacationByIdFromDb(vacationId);

    // Validate vacation days balance for regular vacation (Wypoczynkowy or Na żądanie)
    if (vacationType === "Wypoczynkowy" || vacationType === "Na żądanie") {
      if (currentVacation && currentVacation.userId) {
        const vacationDaysInfo = await getVacationDaysInfoFromDb(
          currentVacation.userId,
        );

        if (vacationDaysInfo) {
          // Calculate original days if it was also a regular vacation
          const originalDays =
            currentVacation.typeName === "Wypoczynkowy" || currentVacation.typeName === "Na żądanie"
              ? calculateBusinessDays(
                  currentVacation.startDate || "",
                  currentVacation.endDate || "",
                )
              : 0;

          // Adjusted remaining = current remaining + original days (to not count them twice)
          const adjustedRemaining =
            vacationDaysInfo.vacationDaysRemaining + originalDays;

          const requestedDays = calculateBusinessDays(startDate, endDate);
          const remainingAfter = adjustedRemaining - requestedDays;

          if (remainingAfter < 0) {
            return NextResponse.json(
              {
                ok: false,
                error: `Niewystarczająca liczba dni urlopowych. Dostępne: ${adjustedRemaining}, wnioskowane: ${requestedDays}`,
              },
              { status: 400 },
            );
          }
        }
      }
    }

    // Update vacation
    const updatedVacation = await updateVacationInDb(vacationId, {
      typeId: typeRecord.id,
      statusId: statusRecord.id,
      startDate,
      endDate,
    });

    // Adjust vacation days balance if needed
    if (currentVacation && currentVacation.userId) {
      const originalWasRegular = currentVacation.typeName === "Wypoczynkowy" || currentVacation.typeName === "Na żądanie";
      const newIsRegular = vacationType === "Wypoczynkowy" || vacationType === "Na żądanie";

      const originalDays = originalWasRegular
        ? calculateBusinessDays(currentVacation.startDate || "", currentVacation.endDate || "")
        : 0;
      const newDays = newIsRegular ? calculateBusinessDays(startDate, endDate) : 0;

      // Calculate the difference and update balance
      // If original was 5 days and new is 3 days: add 2 days back (+2)
      // If original was 3 days and new is 5 days: subtract 2 more days (-2)
      const daysDifference = originalDays - newDays;
      if (daysDifference !== 0) {
        await updateVacationDaysInDb(currentVacation.userId, daysDifference);
      }
    }

    if (!updatedVacation || updatedVacation.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Vacation not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: updatedVacation[0],
        message: "Vacation updated successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update vacation",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const vacationId = Number(params.id);

    // Validate ID
    if (Number.isNaN(vacationId) || vacationId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid vacation ID",
        },
        { status: 400 },
      );
    }

    // Get vacation details before deleting to restore days
    const vacationToDelete = await getVacationByIdFromDb(vacationId);

    const { deleteVacationFromDb } = await import(
      "@/dataBase/query/vacations/deleteVacationFromDb"
    );
    const deletedVacation = await deleteVacationFromDb(vacationId);

    if (!deletedVacation || deletedVacation.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Vacation not found",
        },
        { status: 404 },
      );
    }

    // Restore vacation days if it was a regular vacation
    if (vacationToDelete && vacationToDelete.userId && (vacationToDelete.typeName === "Wypoczynkowy" || vacationToDelete.typeName === "Na żądanie")) {
      const daysToRestore = calculateBusinessDays(
        vacationToDelete.startDate || "",
        vacationToDelete.endDate || ""
      );
      if (daysToRestore > 0) {
        await updateVacationDaysInDb(vacationToDelete.userId, daysToRestore);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        data: deletedVacation[0],
        message: "Vacation deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete vacation",
      },
      { status: 500 },
    );
  }
}
