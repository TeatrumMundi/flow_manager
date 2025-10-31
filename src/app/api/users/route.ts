import { NextResponse } from "next/server";
import { createUserInDb } from "@/dataBase/query/createUserInDb";
import { deleteMultipleUsersFromDb } from "@/dataBase/query/deleteUserFromDb";
import { listUsersFromDb } from "@/dataBase/query/listUsersFromDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract optional filters from query parameters
    const filters = {
      firstName: searchParams.get("firstName") || undefined,
      lastName: searchParams.get("lastName") || undefined,
      email: searchParams.get("email") || undefined,
      roleName: searchParams.get("roleName") || undefined,
      employmentType: searchParams.get("employmentType") || undefined,
    };

    const users = await listUsersFromDb(filters);

    return NextResponse.json({ ok: true, data: users }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to list users",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic shape extraction and normalization
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const roleName = body.roleName ? String(body.roleName) : undefined;

    const profile = body.profile ?? {};

    const result = await createUserInDb({
      email,
      password,
      roleName,
      profile: {
        firstName: profile.firstName ?? null,
        lastName: profile.lastName ?? null,
        position: profile.position ?? null,
        employmentTypeId:
          profile.employmentTypeId === null ||
          profile.employmentTypeId === undefined
            ? null
            : Number(profile.employmentTypeId),
        supervisorId:
          profile.supervisorId === null || profile.supervisorId === undefined
            ? null
            : Number(profile.supervisorId),
        salaryRate:
          profile.salaryRate === undefined || profile.salaryRate === ""
            ? null
            : String(profile.salaryRate),
        vacationDaysTotal:
          profile.vacationDaysTotal === undefined ||
          profile.vacationDaysTotal === ""
            ? null
            : Number(profile.vacationDaysTotal),
      },
    });

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    // Validate that userIds is an array of numbers
    if (!Array.isArray(body.userIds)) {
      return NextResponse.json(
        {
          ok: false,
          error: "userIds must be an array",
        },
        { status: 400 },
      );
    }

    const userIds = body.userIds.filter(
      (id: unknown) => typeof id === "number",
    );

    if (userIds.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "No valid user IDs provided",
        },
        { status: 400 },
      );
    }

    const result = await deleteMultipleUsersFromDb(userIds);

    return NextResponse.json(
      {
        ok: true,
        data: {
          deletedCount: result.deletedCount,
          emails: result.emails,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete users",
      },
      { status: 500 },
    );
  }
}
