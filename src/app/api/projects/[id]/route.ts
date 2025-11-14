import { NextResponse } from "next/server";
import { deleteProjectFromDb } from "@/dataBase/query/projects/deleteProjectFromDb";
import { updateProjectInDb } from "@/dataBase/query/projects/updateProjectInDb";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    // Validate ID
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

    const result = await updateProjectInDb({
      projectId,
      name: body.name !== undefined ? String(body.name) : undefined,
      description:
        body.description === undefined
          ? undefined
          : body.description === "" || body.description === null
            ? null
            : String(body.description),
      status:
        body.status === undefined
          ? undefined
          : body.status === "" || body.status === null
            ? null
            : String(body.status),
      budget:
        body.budget === undefined
          ? undefined
          : body.budget === "" || body.budget === null
            ? null
            : String(body.budget),
      progress:
        body.progress === undefined
          ? undefined
          : body.progress === "" || body.progress === null
            ? null
            : Number(body.progress),
      startDate:
        body.startDate === undefined
          ? undefined
          : body.startDate === "" || body.startDate === null
            ? null
            : String(body.startDate),
      endDate:
        body.endDate === undefined
          ? undefined
          : body.endDate === "" || body.endDate === null
            ? null
            : String(body.endDate),
      isArchived:
        body.isArchived !== undefined ? body.isArchived === true : undefined,
    });

    return NextResponse.json(
      {
        ok: true,
        data: result,
        message: `Successfully updated project: ${result.project.name}`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Handle "not found" errors with 404
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 404 },
      );
    }

    // Handle validation errors with 400
    if (
      error instanceof Error &&
      (error.message.includes("cannot be empty") ||
        error.message.includes("must be between"))
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    // Handle other errors with 500
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update project",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const projectId = Number(params.id);

    // Validate ID
    if (Number.isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      );
    }

    const result = await deleteProjectFromDb(projectId);

    return NextResponse.json(
      {
        ok: true,
        data: result,
        message: `Successfully deleted project: ${result.name}`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Handle "not found" errors with 404
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 404 },
      );
    }

    // Handle other errors with 500
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete project",
      },
      { status: 500 },
    );
  }
}
