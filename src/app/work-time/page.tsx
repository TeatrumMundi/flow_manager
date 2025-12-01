import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { WorkTimeView } from "@/components/workTime/WorkTimeView";

const mockWorkLogs = [
  {
    id: 1,
    employeeName: "Jan Kowalski",
    date: "2024-04-01",
    projectName: "Development",
    taskName: "Frontend implementation",
    hours: 8,
    isOvertime: true,
    note: "Frontend landing page",
  },
  {
    id: 2,
    employeeName: "Anna Nowak",
    date: "2024-04-02",
    projectName: "HR",
    taskName: "Recruitment process",
    hours: 6,
    isOvertime: false,
    note: "Interviewing candidates",
  },
  {
    id: 3,
    employeeName: "Piotr Wiśniewski",
    date: "2024-04-02",
    projectName: "Website Redesign",
    taskName: "Design system",
    hours: 7,
    isOvertime: true,
    note: "Creating Figma components",
  },
  {
    id: 4,
    employeeName: "Katarzyna Wójcik",
    date: "2024-04-03",
    projectName: "System implementation",
    taskName: "Database setup",
    hours: 5,
    isOvertime: true,
    note: "Initial migration",
  },
  {
    id: 5,
    employeeName: "Marek Lewandowski",
    date: "2024-04-03",
    projectName: "Development",
    taskName: "API Integration",
    hours: 8,
    isOvertime: false,
    note: "Connecting backend endpoints",
  },
];

const availableEmployees = [
  { label: "Jan Kowalski", value: "Jan Kowalski" },
  { label: "Anna Nowak", value: "Anna Nowak" },
  { label: "Piotr Wiśniewski", value: "Piotr Wiśniewski" },
  { label: "Katarzyna Wójcik", value: "Katarzyna Wójcik" },
  { label: "Marek Lewandowski", value: "Marek Lewandowski" },
];

const availableProjects = [
  { label: "Development", value: "Development" },
  { label: "HR", value: "HR" },
  { label: "Website Redesign", value: "Website Redesign" },
  { label: "System implementation", value: "System implementation" },
];

// Tasks mapped by Project Name for the dynamic dropdown
const projectTasksMap: Record<string, { label: string; value: string }[]> = {
  Development: [
    { label: "Frontend implementation", value: "Frontend implementation" },
    { label: "API Integration", value: "API Integration" },
    { label: "Testing", value: "Testing" },
  ],
  HR: [
    { label: "Recruitment process", value: "Recruitment process" },
    { label: "Onboarding", value: "Onboarding" },
  ],
  "Website Redesign": [
    { label: "Design system", value: "Design system" },
    { label: "UX Research", value: "UX Research" },
  ],
  "System implementation": [
    { label: "Database setup", value: "Database setup" },
    { label: "Server config", value: "Server config" },
  ],
};

export default async function WorkTimePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Czas pracy" />
        </div>

        <WorkTimeView
          initialLogs={mockWorkLogs}
          availableEmployees={availableEmployees}
          availableProjects={availableProjects}
          projectTasksMap={projectTasksMap}
        />
      </main>
    </div>
  );
}
