import { NextResponse } from "next/server";
import {
  assignUserToProjectInDb,
  removeUserFromProjectInDb,
  updateUserRoleOnProjectInDb,
} from "@/dataBase/query/projects/assignUserToProjectInDb";
import { listProjectAssignmentsFromDb } from "@/dataBase/query/projects/listProjectAssignmentsFromDb";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - List all assignments for a project
export async function GET(_request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      );
    }

    const assignments = await listProjectAssignmentsFromDb(projectId);

    return NextResponse.json({ ok: true, data: assignments }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch project assignments",
      },
      { status: 500 },
    );
  }
}

// POST - Assign a user to a project
export async function POST(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.userId || !body.roleOnProject) {
      return NextResponse.json(
        {
          ok: false,
          error: "userId and roleOnProject are required",
        },
        { status: 400 },
      );
    }

    const assignment = await assignUserToProjectInDb({
      userId: Number(body.userId),
      projectId,
      roleOnProject: String(body.roleOnProject),
    });

    return NextResponse.json(
      {
        ok: true,
        data: assignment,
        message: "User successfully assigned to project",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to assign user to project",
      },
      { status: 500 },
    );
  }
}

// PUT - Update user's role on project
export async function PUT(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.userId || !body.roleOnProject) {
      return NextResponse.json(
        {
          ok: false,
          error: "userId and roleOnProject are required",
        },
        { status: 400 },
      );
    }

    const updated = await updateUserRoleOnProjectInDb(
      Number(body.userId),
      projectId,
      String(body.roleOnProject),
    );

    return NextResponse.json(
      {
        ok: true,
        data: updated,
        message: "User role successfully updated",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update user role",
      },
      { status: 500 },
    );
  }
}

// DELETE - Remove user from project
export async function DELETE(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        {
          ok: false,
          error: "userId is required",
        },
        { status: 400 },
      );
    }

    await removeUserFromProjectInDb(Number(body.userId), projectId);

    return NextResponse.json(
      {
        ok: true,
        message: "User successfully removed from project",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove user from project",
      },
      { status: 500 },
    );
  }
}
