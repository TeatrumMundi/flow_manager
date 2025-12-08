import { NextResponse } from "next/server";
import { auth } from "@/auth";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { createWorkLogInDb } from "@/dataBase/query/workLogs/createWorkLogInDb";
import { listWorkLogsByUserFromDb } from "@/dataBase/query/workLogs/listWorkLogsByUserFromDb";
import { listWorkLogsFromDb } from "@/dataBase/query/workLogs/listWorkLogsFromDb";

// GET /api/work-logs - List all work logs
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userProfile = await getFullUserProfileFromDbByEmail(
      session.user.email,
    );

    const fullAccessRoles = ["Administrator", "Zarząd"];
    const viewAllRoles = ["HR", "Księgowość"];

    const hasFullAccess = userProfile?.role?.name
      ? fullAccessRoles.includes(userProfile.role.name)
      : false;

    const canViewAll = userProfile?.role?.name
      ? viewAllRoles.includes(userProfile.role.name)
      : false;

    const workLogs =
      hasFullAccess || canViewAll || !userProfile?.id
        ? await listWorkLogsFromDb()
        : await listWorkLogsByUserFromDb(userProfile.id);

    return NextResponse.json({ ok: true, data: workLogs });
  } catch (error) {
    console.error("Error fetching work logs:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch work logs" },
      { status: 500 },
    );
  }
}

// POST /api/work-logs - Create new work log
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, taskId, projectId, date, hoursWorked, isOvertime, note } =
      body;

    // Validate required fields
    if (!userId || !projectId || !date || !hoursWorked) {
      return NextResponse.json(
        {
          ok: false,
          error: "User ID, project ID, date, and hours worked are required",
        },
        { status: 400 },
      );
    }

    const result = await createWorkLogInDb({
      userId: Number(userId),
      taskId: taskId ? Number(taskId) : null,
      projectId: Number(projectId),
      date,
      hoursWorked: String(hoursWorked),
      isOvertime: isOvertime || false,
      note: note || null,
    });

    return NextResponse.json({ ok: true, data: result.workLog });
  } catch (error) {
    console.error("Error creating work log:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create work log",
      },
      { status: 500 },
    );
  }
}
