import { NextResponse } from "next/server";
import { createProjectInDb } from "@/dataBase/query/projects/createProjectInDb";
import { deleteMultipleProjectsFromDb } from "@/dataBase/query/projects/deleteProjectFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract optional filters from query parameters
    const filters = {
      name: searchParams.get("name") || undefined,
      isArchived:
        searchParams.get("isArchived") === "true"
          ? true
          : searchParams.get("isArchived") === "false"
            ? false
            : undefined,
      minProgress: searchParams.get("minProgress")
        ? Number(searchParams.get("minProgress"))
        : undefined,
      maxProgress: searchParams.get("maxProgress")
        ? Number(searchParams.get("maxProgress"))
        : undefined,
      minBudget: searchParams.get("minBudget") || undefined,
      maxBudget: searchParams.get("maxBudget") || undefined,
      startDateFrom: searchParams.get("startDateFrom") || undefined,
      startDateTo: searchParams.get("startDateTo") || undefined,
      endDateFrom: searchParams.get("endDateFrom") || undefined,
      endDateTo: searchParams.get("endDateTo") || undefined,
    };

    const projects = await listProjectsFromDb(filters);

    return NextResponse.json({ ok: true, data: projects }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to list projects",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic shape extraction and normalization
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        {
          ok: false,
          error: "Project name is required",
        },
        { status: 400 },
      );
    }

    const projectPayload = {
      name,
      description:
        body.description === undefined ||
        body.description === null ||
        body.description === ""
          ? null
          : body.description,
      status:
        body.status === undefined || body.status === null || body.status === ""
          ? null
          : body.status,
      budget:
        body.budget === undefined || body.budget === null || body.budget === ""
          ? null
          : body.budget,
      progress:
        body.progress === undefined ||
        body.progress === null ||
        body.progress === ""
          ? null
          : Number(body.progress),
      startDate:
        body.startDate === undefined ||
        body.startDate === null ||
        body.startDate === ""
          ? null
          : body.startDate,
      endDate:
        body.endDate === undefined ||
        body.endDate === null ||
        body.endDate === ""
          ? null
          : body.endDate,
      isArchived: body.isArchived === true,
    };

    // Create the project
    const result = await createProjectInDb(projectPayload);

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    // Validate that projectIds is an array of numbers
    if (!Array.isArray(body.projectIds)) {
      return NextResponse.json(
        {
          ok: false,
          error: "projectIds must be an array",
        },
        { status: 400 },
      );
    }

    const projectIds = body.projectIds.filter(
      (id: unknown) => typeof id === "number" && id > 0,
    );

    if (projectIds.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "No valid project IDs provided",
        },
        { status: 400 },
      );
    }

    const result = await deleteMultipleProjectsFromDb(projectIds);

    return NextResponse.json(
      {
        ok: true,
        data: result,
        message: `Successfully deleted ${result.deletedCount} project(s)`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete projects",
      },
      { status: 500 },
    );
  }
}
