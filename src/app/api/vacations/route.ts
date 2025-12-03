import { NextResponse } from "next/server";
import { createVacationInDb } from "@/dataBase/query/vacations/createVacationInDb";
import { listVacationsByUserFromDb } from "@/dataBase/query/vacations/listVacationsByUserFromDb";
import { listVacationStatusesFromDb } from "@/dataBase/query/vacations/listVacationStatusesFromDb";
import { listVacationsFromDb } from "@/dataBase/query/vacations/listVacationsFromDb";
import { listVacationTypesFromDb } from "@/dataBase/query/vacations/listVacationTypesFromDb";

export async function GET(request: Request) {
  try {
    // Check for userId query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Fetch vacations - filtered by userId if provided
    const vacationsData = userId
      ? await listVacationsByUserFromDb(Number(userId))
      : await listVacationsFromDb();

    const vacations = vacationsData.map((vacation) => ({
      id: vacation.id,
      visibleUserId: vacation.userId,
      employeeName: vacation.employeeName || "Nieznany pracownik",
      vacationType: vacation.vacationType || "Nieznany typ",
      startDate: vacation.startDate || "",
      endDate: vacation.endDate || "",
      status: vacation.status || "Nieznany",
      createdAt: vacation.createdAt || "",
    }));

    return NextResponse.json({ ok: true, data: vacations }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to list vacations",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, vacationType, startDate, endDate } = body;

    // Validate required fields
    if (!employeeId || !vacationType || !startDate || !endDate) {
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

    // Get vacation statuses and find "Oczekujący" (Pending) status
    const vacationStatuses = await listVacationStatusesFromDb();
    const pendingStatus = vacationStatuses.find((s) => s.name === "Oczekujący");

    if (!pendingStatus) {
      return NextResponse.json(
        {
          ok: false,
          error: "Pending status not found in database",
        },
        { status: 500 },
      );
    }

    // Create vacation with pending status
    const newVacation = await createVacationInDb({
      userId: Number(employeeId),
      typeId: typeRecord.id,
      statusId: pendingStatus.id,
      startDate,
      endDate,
    });

    return NextResponse.json(
      { ok: true, data: newVacation[0] },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create vacation",
      },
      { status: 500 },
    );
  }
}
