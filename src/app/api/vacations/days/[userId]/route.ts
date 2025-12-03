import { NextResponse } from "next/server";
import { getVacationDaysInfoFromDb } from "@/dataBase/query/vacations/getVacationDaysInfoFromDb";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const params = await context.params;
    const userId = Number(params.userId);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const vacationDaysInfo = await getVacationDaysInfoFromDb(userId);

    if (!vacationDaysInfo) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { ok: true, data: vacationDaysInfo },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get vacation days info",
      },
      { status: 500 },
    );
  }
}
