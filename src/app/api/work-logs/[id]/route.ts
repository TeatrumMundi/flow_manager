import { NextResponse } from "next/server";
import { deleteWorkLogFromDb } from "@/dataBase/query/workLogs/deleteWorkLogFromDb";
import { getWorkLogByIdFromDb } from "@/dataBase/query/workLogs/getWorkLogByIdFromDb";
import { updateWorkLogInDb } from "@/dataBase/query/workLogs/updateWorkLogInDb";

type Params = Promise<{ id: string }>;

// GET /api/work-logs/[id] - Get work log by ID
export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const workLogId = Number.parseInt(id, 10);

    if (Number.isNaN(workLogId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid work log ID" },
        { status: 400 },
      );
    }

    const workLog = await getWorkLogByIdFromDb(workLogId);

    if (!workLog) {
      return NextResponse.json(
        { ok: false, error: "Work log not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: workLog });
  } catch (error) {
    console.error("Error fetching work log:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch work log" },
      { status: 500 },
    );
  }
}

// PUT /api/work-logs/[id] - Update work log
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const workLogId = Number.parseInt(id, 10);

    if (Number.isNaN(workLogId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid work log ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { userId, taskId, projectId, date, hoursWorked, isOvertime, note } =
      body;

    const result = await updateWorkLogInDb({
      id: workLogId,
      userId: userId !== undefined ? Number(userId) : undefined,
      taskId:
        taskId !== undefined ? (taskId ? Number(taskId) : null) : undefined,
      projectId: projectId !== undefined ? Number(projectId) : undefined,
      date: date !== undefined ? date : undefined,
      hoursWorked: hoursWorked !== undefined ? String(hoursWorked) : undefined,
      isOvertime: isOvertime !== undefined ? isOvertime : undefined,
      note: note !== undefined ? note : undefined,
    });

    return NextResponse.json({ ok: true, data: result.workLog });
  } catch (error) {
    console.error("Error updating work log:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update work log",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/work-logs/[id] - Delete work log
export async function DELETE(
  _request: Request,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const workLogId = Number.parseInt(id, 10);

    if (Number.isNaN(workLogId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid work log ID" },
        { status: 400 },
      );
    }

    await deleteWorkLogFromDb(workLogId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting work log:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete work log",
      },
      { status: 500 },
    );
  }
}
