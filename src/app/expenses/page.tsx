import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ExpensesView } from "@/components/expenses/ExpenseView";

const mockExpenses = [
  {
    id: 1,
    name: "Laptop Dell XPS",
    category: "Sprzęt",
    projectName: "Website Redesign",
    amount: 10000,
    date: "2024-04-15",
    status: "Zatwierdzony",
  },
  {
    id: 2,
    name: "Usługi konsultingowe",
    category: "Usługi",
    projectName: "System implementation",
    amount: 15000,
    date: "2024-04-10",
    status: "Oczekujący",
  },
  {
    id: 3,
    name: "Materiały biurowe",
    category: "Zaopatrzenie",
    projectName: "Mobile App",
    amount: 5000,
    date: "2024-04-05",
    status: "Zatwierdzony",
  },
  {
    id: 4,
    name: "Subskrypcja Adobe",
    category: "Oprogramowanie",
    projectName: "Website Redesign",
    amount: 200,
    date: "2024-04-01",
    status: "Odrzucony",
  },
  {
    id: 5,
    name: "Serwer testowy",
    category: "Infrastruktura",
    projectName: "Mobile App",
    amount: 1200,
    date: "2024-05-02",
    status: "Zatwierdzony",
  },
];

const availableCategories = [
  "Sprzęt",
  "Usługi",
  "Zaopatrzenie",
  "Oprogramowanie",
  "Infrastruktura",
  "Inne",
];

const availableProjects = [
  "Website Redesign",
  "System implementation",
  "Mobile App",
  "HR Revamp",
  "Ogólne",
];

export default async function ExpensesPage() {
  return (
      <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
        <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <BackToDashboardButton />
            <SectionTitleTile title="Wydatki" />
          </div>

          <ExpensesView
              initialExpenses={mockExpenses}
              availableCategories={availableCategories}
              availableProjects={availableProjects}
          />
        </main>
      </div>
  );
}