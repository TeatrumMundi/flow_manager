import { type NextRequest, NextResponse } from "next/server";
import { deleteUserFromDb } from "@/dataBase/query/users/deleteUserFromDb";
import { updateUserInDb } from "@/dataBase/query/users/updateUserInDb";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate ID is a valid number
    const userId = Number(id);
    if (!id || Number.isNaN(userId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Validate required fields for update
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Request body is required" },
        { status: 400 },
      );
    }

    const userUpdateResult = await updateUserInDb({
      userId,
      email: body.email,
      password: body.password || null,
      roleName: body.roleName,
      profile: body.profile,
    });

    return NextResponse.json(
      { ok: true, data: userUpdateResult },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate ID is a valid number
    const userId = Number(id);
    if (!id || Number.isNaN(userId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const userDeletionResult = await deleteUserFromDb(userId);

    return NextResponse.json(
      { ok: true, data: userDeletionResult },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 400 },
    );
  }
}
