import { NextResponse } from "next/server";
import { listVacationStatusesFromDb } from "@/dataBase/query/vacations/listVacationStatusesFromDb";
import { listVacationTypesFromDb } from "@/dataBase/query/vacations/listVacationTypesFromDb";
import { updateVacationInDb } from "@/dataBase/query/vacations/updateVacationInDb";

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

    // Update vacation
    const updatedVacation = await updateVacationInDb(vacationId, {
      typeId: typeRecord.id,
      statusId: statusRecord.id,
      startDate,
      endDate,
    });

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
