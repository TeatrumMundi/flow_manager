import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ReportsView } from "@/components/reports/ReportsView";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";
import { getAbsenceStatsFromDb } from "@/dataBase/query/reports/getAbsenceStatsFromDb";
import { getTaskStatsFromDb } from "@/dataBase/query/reports/getTaskStatsFromDb";
import { getWorkHoursStatsFromDb } from "@/dataBase/query/reports/getWorkHoursStatsFromDb";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
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

  const [projectsData, taskStats, absenceStats, workHoursStats] =
    await Promise.all([
      listProjectsFromDb(),
      getTaskStatsFromDb({
        projectId,
        dateFrom: dateFromFull,
        dateTo: dateToFull,
      }),
      getAbsenceStatsFromDb({
        projectId,
        dateFrom: dateFromFull,
        dateTo: dateToFull,
      }),

      getWorkHoursStatsFromDb({
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

  const reportData = {
    tasks: taskStats,
    workHours: { totalHours: workHoursStats },
    absence: absenceStats,
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Raporty" />
        </div>

        <ReportsView
          availableProjects={availableProjects}
          initialData={reportData}
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
