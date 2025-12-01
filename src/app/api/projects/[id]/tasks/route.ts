import { NextResponse } from "next/server";
import { createTaskInDb } from "@/dataBase/query/tasks/createTaskInDb";
import { listTasksByProjectFromDb } from "@/dataBase/query/tasks/listTasksByProjectFromDb";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - List all tasks for a project
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

    const tasks = await listTasksByProjectFromDb(projectId);

    return NextResponse.json({ ok: true, data: tasks }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch project tasks",
      },
      { status: 500 },
    );
  }
}

// POST - Create a new task for a project
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

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        {
          ok: false,
          error: "Task title is required",
        },
        { status: 400 },
      );
    }

    const result = await createTaskInDb({
      projectId,
      title: body.title,
      description: body.description || null,
      assignedToId: body.assignedToId || null,
      status: body.status || "To Do",
      estimatedHours: body.estimatedHours || null,
    });

    return NextResponse.json(
      {
        ok: true,
        data: result.task,
        message: "Task created successfully",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create task",
      },
      { status: 500 },
    );
  }
}
