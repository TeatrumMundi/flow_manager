import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ExpensesView } from "@/components/expenses/ExpenseView";
import { listExpenseCategoriesFromDb } from "@/dataBase/query/expenses/listExpenseCategoriesFromDb";
import { listExpenseStatusesFromDb } from "@/dataBase/query/expenses/listExpenseStatusesFromDb";
import { listExpensesFromDb } from "@/dataBase/query/expenses/listExpensesFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExpensesPage() {
  const expensesData = await listExpensesFromDb();
  const categories = await listExpenseCategoriesFromDb();
  const statuses = await listExpenseStatusesFromDb();
  const projects = await listProjectsFromDb();

  // Map expenses data to match component expectations
  const expenses = expensesData.map((expense) => ({
    id: expense.id,
    name: expense.name,
    category: expense.categoryName || "Nieznana",
    categoryId: expense.categoryId,
    projectName: expense.projectName || "Brak projektu",
    projectId: expense.projectId,
    amount: Number(expense.amount) || 0,
    date: expense.date || "",
    status: expense.statusName || "Brak statusu",
    statusId: expense.statusId,
  }));

  const availableCategories = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const availableStatuses = statuses.map((status) => ({
    label: status.name,
    value: status.id,
  }));

  const availableProjects = projects.map((project) => ({
    label: project.name || `Projekt #${project.id}`,
    value: project.id,
  }));

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Wydatki" />
        </div>

        <ExpensesView
          initialExpenses={expenses}
          availableCategories={availableCategories}
          availableStatuses={availableStatuses}
          availableProjects={availableProjects}
        />
      </main>
    </div>
  );
}
