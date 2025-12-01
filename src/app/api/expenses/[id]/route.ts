import { NextResponse } from "next/server";
import { deleteExpenseFromDb } from "@/dataBase/query/expenses/deleteExpenseFromDb";
import { getExpenseByIdFromDb } from "@/dataBase/query/expenses/getExpenseByIdFromDb";
import { updateExpenseInDb } from "@/dataBase/query/expenses/updateExpenseInDb";

type Params = Promise<{ id: string }>;

// GET /api/expenses/[id] - Get expense by ID
export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const expenseId = Number.parseInt(id, 10);

    if (Number.isNaN(expenseId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid expense ID" },
        { status: 400 },
      );
    }

    const expense = await getExpenseByIdFromDb(expenseId);

    if (!expense) {
      return NextResponse.json(
        { ok: false, error: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch expense" },
      { status: 500 },
    );
  }
}

// PUT /api/expenses/[id] - Update expense
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const expenseId = Number.parseInt(id, 10);

    if (Number.isNaN(expenseId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid expense ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, categoryId, projectId, amount, date, statusId } = body;

    const normalizedProjectId =
      projectId !== undefined
        ? (projectId ? Number(projectId) : null)
        : undefined;
    const normalizedStatusId =
      statusId !== undefined
        ? (statusId ? Number(statusId) : null)
        : undefined;

    const result = await updateExpenseInDb({
      id: expenseId,
      name,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      projectId: normalizedProjectId,
      amount: amount !== undefined ? String(amount) : undefined,
      date: date !== undefined ? date : undefined,
      statusId: normalizedStatusId,
    });

    return NextResponse.json({ ok: true, data: result.expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update expense",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  _request: Request,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const expenseId = Number.parseInt(id, 10);

    if (Number.isNaN(expenseId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid expense ID" },
        { status: 400 },
      );
    }

    await deleteExpenseFromDb(expenseId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete expense",
      },
      { status: 500 },
    );
  }
}
