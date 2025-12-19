/**
 * Finances Page - Financial KPIs, charts, and analytics with date/project filters.
 *
 * This is a Server Component with dynamic rendering (no caching) to ensure
 * users always see up-to-date financial statistics.
 */

// UI Components
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { FinancesView } from "@/components/finances/FinancesView";

// Database queries
import { getFinancialStatsFromDb } from "@/dataBase/query/finances/getFinancialStatsFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";

// Disable static rendering - page requires fresh financial data on each request
export const dynamic = "force-dynamic";

/** Default filter value representing all projects */
const ALL_PROJECTS_VALUE = "Wszystkie" as const;

/** Number of months to look back for default date range */
const DEFAULT_MONTHS_LOOKBACK = 2;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Calculates the default date range (current month minus lookback period).
 * @returns Object with dateFrom and dateTo in YYYY-MM format
 */
function getDefaultDateRange(): { dateFrom: string; dateTo: string } {
  const today = new Date();
  const dateTo = today.toISOString().slice(0, 7);

  // Create new Date to avoid mutating `today`
  const fromDate = new Date(today);
  fromDate.setMonth(fromDate.getMonth() - DEFAULT_MONTHS_LOOKBACK);
  const dateFrom = fromDate.toISOString().slice(0, 7);

  return { dateFrom, dateTo };
}

/**
 * Converts a YYYY-MM string to a full date string representing the first day of the month.
 */
function toFirstDayOfMonth(yearMonth: string): string {
  return `${yearMonth}-01`;
}

/**
 * Converts a YYYY-MM string to a full date string representing the last day of the month.
 */
function toLastDayOfMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  // Day 0 of next month = last day of current month
  return new Date(year, month, 0).toISOString().slice(0, 10);
}

/**
 * Parses project filter parameter and returns numeric ID or undefined for "all".
 */
function parseProjectFilter(
  projectParam: string | undefined,
): number | undefined {
  if (!projectParam || projectParam === ALL_PROJECTS_VALUE) {
    return undefined;
  }
  return Number(projectParam);
}

/**
 * Transforms projects list into select dropdown options with "All" option prepended.
 */
function buildProjectOptions(
  projects: Awaited<ReturnType<typeof listProjectsFromDb>>,
) {
  return [
    { label: ALL_PROJECTS_VALUE, value: ALL_PROJECTS_VALUE },
    ...projects.map((project) => ({
      label: project.name || `Projekt #${project.id}`,
      value: project.id,
    })),
  ];
}

export default async function FinancesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Calculate default date range and merge with URL params
  const { dateFrom: defaultDateFrom, dateTo: defaultDateTo } =
    getDefaultDateRange();
  const dateFromParam = (params.dateFrom as string) || defaultDateFrom;
  const dateToParam = (params.dateTo as string) || defaultDateTo;
  const projectIdParam = params.project as string;

  // Convert YYYY-MM params to full date strings for database query
  const dateFromFull = toFirstDayOfMonth(dateFromParam);
  const dateToFull = toLastDayOfMonth(dateToParam);

  // Parse project filter (undefined means "all projects")
  const projectId = parseProjectFilter(projectIdParam);

  // Fetch all required data in parallel for optimal performance
  const [projectsData, financialStats] = await Promise.all([
    listProjectsFromDb(),
    getFinancialStatsFromDb({
      projectId,
      dateFrom: dateFromFull,
      dateTo: dateToFull,
    }),
  ]);

  // Prepare project dropdown options
  const availableProjects = buildProjectOptions(projectsData);

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        {/* Page header with navigation and title */}
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Finanse" />
        </div>

        {/* Financial dashboard with filters and charts */}
        <FinancesView
          availableProjects={availableProjects}
          initialData={financialStats}
          initialFilters={{
            dateFrom: dateFromParam,
            dateTo: dateToParam,
            project: projectIdParam || ALL_PROJECTS_VALUE,
          }}
        />
      </main>
    </div>
  );
}
