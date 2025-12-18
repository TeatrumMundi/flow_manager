import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { FinancesView } from "@/components/finances/FinancesView";
import { getFinancialStatsFromDb } from "@/dataBase/query/finances/getFinancialStatsFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinancesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const today = new Date();
  const defaultDateTo = today.toISOString().slice(0, 7);
  const defaultDateFrom = new Date(today.setMonth(today.getMonth() - 2))
      .toISOString()
      .slice(0, 7);

  const dateFromParam = (params.dateFrom as string) || defaultDateFrom;
  const dateToParam = (params.dateTo as string) || defaultDateTo;
  const projectIdParam = params.project as string;

  const dateFromFull = `${dateFromParam}-01`;
  const [year, month] = dateToParam.split("-").map(Number);
  const dateToFull = new Date(year, month, 0).toISOString().slice(0, 10);

  const projectId =
      projectIdParam && projectIdParam !== "Wszystkie"
          ? Number(projectIdParam)
          : undefined;

  const [projectsData, financialStats] = await Promise.all([
    listProjectsFromDb(),
    getFinancialStatsFromDb({
      projectId,
      dateFrom: dateFromFull,
      dateTo: dateToFull,
    }),
  ]);

  const availableProjects = [
    { label: "Wszystkie", value: "Wszystkie" },
    ...projectsData.map((p) => ({
      label: p.name || `Projekt #${p.id}`,
      value: p.id,
    })),
  ];

  return (
      <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
        <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <BackToDashboardButton />
            <SectionTitleTile title="Finanse" />
          </div>

          <FinancesView
              availableProjects={availableProjects}
              initialData={financialStats}
              initialFilters={{
                dateFrom: dateFromParam,
                dateTo: dateToParam,
                project: projectIdParam || "Wszystkie",
              }}
          />
        </main>
      </div>
  );
}