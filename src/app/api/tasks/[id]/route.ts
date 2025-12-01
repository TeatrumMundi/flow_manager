import { NextResponse } from "next/server";
import { deleteTaskFromDb } from "@/dataBase/query/tasks/deleteTaskFromDb";
import { updateTaskInDb } from "@/dataBase/query/tasks/updateTaskInDb";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT - Update a task
export async function PUT(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const taskId = Number(params.id);

    if (Number.isNaN(taskId) || taskId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid task ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (body.title !== undefined && body.title.trim() === "") {
      return NextResponse.json(
        {
          ok: false,
          error: "Task title cannot be empty",
        },
        { status: 400 },
      );
    }

    const result = await updateTaskInDb({
      id: taskId,
      title: body.title,
      description: body.description,
      assignedToId: body.assignedToId,
      status: body.status,
      estimatedHours: body.estimatedHours,
    });

    return NextResponse.json(
      {
        ok: true,
        data: result.task,
        message: "Task updated successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to update task",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete a task
export async function DELETE(_request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const taskId = Number(params.id);

    if (Number.isNaN(taskId) || taskId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid task ID",
        },
        { status: 400 },
      );
    }

    const result = await deleteTaskFromDb(taskId);

    return NextResponse.json(
      {
        ok: true,
        data: result,
        message: "Task deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to delete task",
      },
      { status: 500 },
    );
  }
}
