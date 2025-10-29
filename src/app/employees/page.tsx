import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { EmployeeView } from "../components/employees/EmployeeView";

const mockEmployeesData = [
  {
    id: 1,
    name: "Maria Kurowska",
    position: "Projektant UX",
    supervisor: "Michał Nowak",
    salaryRate: "8000 zł",
    vacationDays: 26,
    contractType: "umowa o pracę",
    history: [
      "Projekt A – Tester (I-IIX 2023)",
      "Projekt B – Deweloper (IV-VIII 2023)",
    ],
  },
  {
    id: 2,
    name: "Adam Wiśniewski",
    position: "Backend Developer",
    supervisor: "Anna Kowalska",
    salaryRate: "9500 zł",
    vacationDays: 26,
    contractType: "umowa o pracę",
    history: [
      "Projekt C – Projektant UI (IX-XII 2023)",
      "Projekt D – Starszy projektant UX (I-IV 2024)",
    ],
  },
  {
    id: 3,
    name: "Peter Nowak",
    position: "Projektant UX",
    supervisor: "Michał Nowak",
    salaryRate: "8000 zł",
    vacationDays: 26,
    contractType: "umowa o pracę",
    history: [
      "Projekt A – Tester (I-IIX 2023)",
      "Projekt 8 – Deweloper (IV-VIII 2023)",
      "Projekt C – Projektant UI (IX-XII 2023)",
      "Projekt D – Starszy projektant UX (I-IV 2024)",
    ],
  },
  {
    id: 4,
    name: "Alicja Król",
    position: "Frontend Developer",
    supervisor: "Anna Kowalska",
    salaryRate: "9000 zł",
    vacationDays: 20,
    contractType: "B2B",
    history: ["Projekt E – Junior Dev (V-obecnie)"],
  },
];

export default async function EmployeesPage() {
  const employees = mockEmployeesData;

  return (
      <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
        <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <Link
                href="/profile/me"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Powrót do pulpitu
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Pracownicy</h1>
          </div>

          <EmployeeView initialEmployees={employees} />
        </main>
      </div>
  );
}