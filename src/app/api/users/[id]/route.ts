import { NextResponse } from "next/server";
import { deleteUserFromDb } from "@/dataBase/query/deleteUserFromDb";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = Number(params.id);
    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    const result = await deleteUserFromDb(userId);
    return NextResponse.json({ ok: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
