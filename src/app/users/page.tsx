import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { listSupervisorsFromDb } from "@/dataBase/query/listSupervisorsFromDb";
import { listUsersFromDb } from "@/dataBase/query/listUsersFromDb";
import { UsersTable } from "../components/users/UsersTable";
import { listEmploymentTypesFromDb } from "@/dataBase/query/listEmploymentTypesFromDb";
import type { EmploymentType } from "@/types/EmploymentType";


export default async function UsersPage() {
  // Fetch users from database
  const users = await listUsersFromDb();
  // Fetch supervisors (roleId 1 or 2)
  const supervisors = await listSupervisorsFromDb();
  // Fetch employment types from database
  const employmentTypes: EmploymentType[] = await listEmploymentTypesFromDb();

  // Extract unique roles for filters
  const availableRoles = Array.from(
    new Set(users.map((user) => user.roleName).filter(Boolean)),
  ) as string[];

  // Map employment types to abbreviations (short names)
  const availableEmploymentTypes = employmentTypes.map((type) => type.abbreviation);

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
          <h1 className="text-3xl font-bold text-gray-800">
            Zarządzanie Użytkownikami
          </h1>
        </div>

        <UsersTable
          initialUsers={users}
          availableRoles={availableRoles}
          availableEmploymentTypes={availableEmploymentTypes}
          supervisors={supervisors}
        />
      </main>
    </div>
  );
}
