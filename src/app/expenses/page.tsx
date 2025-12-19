/**
 * Expenses Page - Manage company expenses with categories, statuses, and project associations.
 *
 * This is a Server Component with dynamic rendering (no caching) to ensure
 * users always see the most up-to-date expense data.
 */

// UI Components
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ExpensesView } from "@/components/expenses/ExpenseView";

// Database queries
import { listExpenseCategoriesFromDb } from "@/dataBase/query/expenses/listExpenseCategoriesFromDb";
import { listExpenseStatusesFromDb } from "@/dataBase/query/expenses/listExpenseStatusesFromDb";
import { listExpensesFromDb } from "@/dataBase/query/expenses/listExpensesFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";

// Disable static rendering and caching - page requires fresh data on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Default fallback values for missing data */
const FALLBACKS = {
  category: "Nieznana",
  project: "Brak projektu",
  status: "Brak statusu",
  date: "",
} as const;

/** Type for select dropdown options used in forms */
interface SelectOption {
  label: string;
  value: number;
}

/**
 * Transforms raw expense data into display-friendly format.
 */
function transformExpensesForDisplay(
  expensesData: Awaited<ReturnType<typeof listExpensesFromDb>>,
) {
  return expensesData.map((expense) => ({
    id: expense.id,
    name: expense.name,
    category: expense.categoryName ?? FALLBACKS.category,
    categoryId: expense.categoryId,
    projectName: expense.projectName ?? FALLBACKS.project,
    projectId: expense.projectId,
    amount: Number(expense.amount) || 0,
    date: expense.date ?? FALLBACKS.date,
    status: expense.statusName ?? FALLBACKS.status,
    statusId: expense.statusId,
  }));
}

/**
 * Converts categories to select dropdown options.
 */
function mapCategoriesToOptions(
  categories: Awaited<ReturnType<typeof listExpenseCategoriesFromDb>>,
): SelectOption[] {
  return categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
}

/**
 * Converts statuses to select dropdown options.
 */
function mapStatusesToOptions(
  statuses: Awaited<ReturnType<typeof listExpenseStatusesFromDb>>,
): SelectOption[] {
  return statuses.map((status) => ({
    label: status.name,
    value: status.id,
  }));
}

/**
 * Converts projects to select dropdown options with fallback label.
 */
function mapProjectsToOptions(
  projects: Awaited<ReturnType<typeof listProjectsFromDb>>,
): SelectOption[] {
  return projects.map((project) => ({
    label: project.name || `Projekt #${project.id}`,
    value: project.id,
  }));
}

export default async function ExpensesPage() {
  // Fetch all required data in parallel for optimal performance
  const [expensesData, categories, statuses, projects] = await Promise.all([
    listExpensesFromDb(),
    listExpenseCategoriesFromDb(),
    listExpenseStatusesFromDb(),
    listProjectsFromDb(),
  ]);

  // Transform raw data for presentation layer
  const expenses = transformExpensesForDisplay(expensesData);

  // Prepare select options for form dropdowns
  const availableCategories = mapCategoriesToOptions(categories);
  const availableStatuses = mapStatusesToOptions(statuses);
  const availableProjects = mapProjectsToOptions(projects);

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        {/* Page header with navigation and title */}
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Wydatki" />
        </div>

        {/* Main expenses list/management view */}
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
