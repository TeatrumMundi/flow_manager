import { type NextRequest, NextResponse } from "next/server";
import { deleteUserFromDb } from "@/dataBase/query/deleteUserFromDb";

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
