import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { UsersInterface } from "@/components/users/UsersInterface";
import { listEmploymentTypesFromDb } from "@/dataBase/query/listEmploymentTypesFromDb";
import { listSupervisorsFromDb } from "@/dataBase/query/listSupervisorsFromDb";
import { listUserRolesFromDb } from "@/dataBase/query/listUserRolesFromDb";
import { listUsersFromDb } from "@/dataBase/query/listUsersFromDb";
import type { EmploymentType } from "@/types/EmploymentType";
import type { UserRoles } from "@/types/UserRole";

export default async function UsersPage() {
  // Fetch users from database
  const users = await listUsersFromDb();
  // Fetch supervisors (roleId 1 or 2)
  const supervisors = await listSupervisorsFromDb();
  // Fetch employment types
  const employmentTypes: EmploymentType[] = await listEmploymentTypesFromDb();
  // Fetch unique roles
  const roleTypes: UserRoles[] = await listUserRolesFromDb();

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Użytkownicy" />
        </div>

        <UsersInterface
          initialUsers={users}
          roleTypes={roleTypes}
          availableEmploymentTypes={employmentTypes}
          supervisors={supervisors}
        />
      </main>
    </div>
  );
}
