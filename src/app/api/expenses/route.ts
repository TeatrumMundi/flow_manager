import { NextResponse } from "next/server";
import { createExpenseInDb } from "@/dataBase/query/expenses/createExpenseInDb";
import { listExpensesFromDb } from "@/dataBase/query/expenses/listExpensesFromDb";

// GET /api/expenses - List all expenses
export async function GET() {
  try {
    const expenses = await listExpensesFromDb();
    return NextResponse.json({ ok: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId, projectId, amount, date, statusId } = body;

    // Validate required fields
    if (!name || !categoryId || !amount) {
      return NextResponse.json(
        { ok: false, error: "Name, category, and amount are required" },
        { status: 400 },
      );
    }

    const result = await createExpenseInDb({
      name,
      categoryId: Number(categoryId),
      projectId: projectId ? Number(projectId) : null,
      amount: String(amount),
      date: date || null,
      statusId: statusId ? Number(statusId) : null,
    });

    return NextResponse.json({ ok: true, data: result.expense });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create expense",
      },
      { status: 500 },
    );
  }
}
