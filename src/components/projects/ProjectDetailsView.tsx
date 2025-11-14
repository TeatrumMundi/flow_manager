"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { Button } from "@/components/common/CustomButton";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { ProjectAssignmentListItem } from "@/dataBase/query/projects/listProjectAssignmentsFromDb";
import type { UserListItem } from "@/dataBase/query/users/listUsersFromDb";
import { ProgressBar } from "./ProgressBar";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

const PROJECT_ROLES = [
  "Developer",
  "Manager",
  "Designer",
  "Tester",
  "Analyst",
  "DevOps",
  "Other",
];

interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  manager?: string;
  progress: number;
  budget: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface ProjectDetailsViewProps {
  project: Project;
  allUsers: UserListItem[];
  onBack: () => void;
}

const mockTasks = [
  {
    id: 1,
    name: "Design Review",
    worker: "Piotr Wiśniewski",
    status: "Aktywny",
    hours: 40,
  },
  {
    id: 2,
    name: "Backend development",
    worker: "Jan Kowalski",
    status: "W toku",
    hours: 150,
  },
  {
    id: 3,
    name: "Frontend development",
    worker: "Marek Lewandowski",
    status: "Zakończony",
    hours: 250,
  },
  {
    id: 4,
    name: "Final Testing",
    worker: "Katarzyna Wójcik",
    status: "Zakończony",
    hours: 80,
  },
];

export function ProjectDetailsView({
  project,
  allUsers,
  onBack,
}: ProjectDetailsViewProps) {
  const [assignments, setAssignments] = useState<ProjectAssignmentListItem[]>(
    [],
  );
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState(PROJECT_ROLES[0]);

  // Get manager from assignments
  const projectManager = assignments.find((a) => a.roleOnProject === "Manager");
  const managerName = projectManager
    ? `${projectManager.firstName} ${projectManager.lastName}`
    : null;

  // Fetch project assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/api/projects/${project.id}/assignments`);
        const data = await response.json();
        if (data.ok) {
          setAssignments(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [project.id]);

  const handleRefreshAssignments = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/assignments`);
      const data = await response.json();
      if (data.ok) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error("Failed to refresh assignments:", error);
    }
  };

  // Get available users (not already assigned)
  const availableUsers = allUsers.filter(
    (user) => !assignments.some((a) => a.userId === user.id),
  );

  const handleAssignUser = async () => {
    if (!selectedUserId) {
      toast.error("Wybierz użytkownika");
      return;
    }

    const assignPromise = async () => {
      const response = await fetch(`/api/projects/${project.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(selectedUserId),
          roleOnProject: selectedRole,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to assign user");
      }

      return data;
    };

    await toast.promise(assignPromise(), {
      loading: "Przypisywanie użytkownika...",
      success: "Użytkownik został przypisany!",
      error: (err) => `Błąd: ${err.message}`,
    });

    await handleRefreshAssignments();
    setSelectedUserId("");
    setSelectedRole(PROJECT_ROLES[0]);
  };

  const handleRemoveUser = async (userId: number, userName: string) => {
    const removePromise = async () => {
      const response = await fetch(`/api/projects/${project.id}/assignments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to remove user");
      }

      return data;
    };

    await toast.promise(removePromise(), {
      loading: `Usuwanie ${userName}...`,
      success: `${userName} został usunięty z projektu`,
      error: (err) => `Błąd: ${err.message}`,
    });

    await handleRefreshAssignments();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <BackToDashboardButton className="" onClick={onBack}>
            Powrót
          </BackToDashboardButton>
          <div>
            <p className="text-sm text-slate-500">Projekt</p>
            <h1 className="text-2xl font-bold text-slate-800">
              {project.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-600">Status:</p>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Assigned employees tile */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Przypisani pracownicy ({assignments.length})
              </h2>
            </div>
            {isLoadingAssignments ? (
              <p className="text-slate-500 p-6">Ładowanie...</p>
            ) : (
              <div>
                {assignments.length > 0 && (
                  <ul className="divide-y divide-slate-200">
                    {assignments.map((assignment) => (
                      <li
                        key={assignment.assignmentId}
                        className="flex justify-between items-center p-4 hover:bg-slate-50/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                            {assignment.firstName?.[0]}
                            {assignment.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {assignment.firstName} {assignment.lastName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {assignment.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                            {assignment.roleOnProject}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveUser(
                                assignment.userId,
                                `${assignment.firstName} ${assignment.lastName}`,
                              )
                            }
                            className={
                              "p-2 rounded-md transition-colors cursor-pointer border bg-red-100 hover:bg-red-200 text-red-600 border-red-200 h-9 w-9 flex items-center justify-center"
                            }
                            title={
                              assignment.roleOnProject === "Manager"
                                ? "Usuń managera projektu"
                                : "Usuń z projektu"
                            }
                          >
                            <FaTrash size={16} className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Add new user form */}
                <div className="p-6 bg-slate-50/70 rounded-b-xl">
                  <h3 className="text-base font-semibold text-slate-700 mb-3">
                    Przypisz nowego użytkownika
                  </h3>
                  {selectedRole === "Manager" && projectManager && (
                    <div className="mb-3 p-3 bg-yellow-100 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                      <p>
                        <strong>Uwaga:</strong> Przypisanie nowego Managera
                        automatycznie usunie obecnego (
                        {projectManager.firstName} {projectManager.lastName}).
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="w-full sm:flex-1">
                      <CustomSelect
                        label="Użytkownik"
                        name="userId"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        searchable
                        options={[
                          { label: "Wybierz użytkownika...", value: "" },
                          ...availableUsers.map((user) => ({
                            label: `${user.firstName || ""} ${
                              user.lastName || ""
                            } (${user.email})`.trim(),
                            value: user.id,
                          })),
                        ]}
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <CustomSelect
                        label="Rola"
                        name="role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        options={PROJECT_ROLES.map((role) => ({
                          label: role,
                          value: role,
                        }))}
                      />
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleAssignUser}
                      disabled={!selectedUserId}
                      className="w-full sm:w-auto"
                    >
                      <FaPlus />
                      <span>Przypisz</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tasks tile */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Zadania w projekcie
              </h2>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-600 text-sm">
                      Nazwa
                    </th>
                    <th className="p-4 font-semibold text-slate-600 text-sm">
                      Pracownik
                    </th>
                    <th className="p-4 font-semibold text-slate-600 text-sm">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-slate-600 text-sm text-right">
                      Godziny
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                    >
                      <td className="p-4 text-slate-800 font-medium">
                        {task.name}
                      </td>
                      <td className="p-4 text-slate-600">{task.worker}</td>
                      <td className="p-4">
                        <ProjectStatusBadge status={task.status} />
                      </td>
                      <td className="p-4 text-slate-600 text-right font-mono">
                        {task.hours}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Details tile */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Szczegóły projektu
            </h2>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-sm font-medium text-slate-500">Postęp</p>
                <p className="text-sm font-bold text-blue-600">
                  {project.progress}%
                </p>
              </div>
              <ProgressBar progress={project.progress} />
            </div>

            <dl className="space-y-4">
              {managerName && (
                <div>
                  <dt className="text-sm font-medium text-slate-500 mb-1">
                    Kierownik projektu
                  </dt>
                  <dd className="text-slate-800 font-semibold">
                    {managerName}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">
                  Budżet
                </dt>
                <dd className="text-xl font-bold text-slate-800">
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                    minimumFractionDigits: 0,
                  }).format(project.budget)}
                </dd>
              </div>
            </dl>

            {/* Timeline */}
            {(project.startDate || project.endDate) && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Terminy
                </h3>
                <dl className="grid grid-cols-2 gap-4">
                  {project.startDate && (
                    <div>
                      <dt className="text-sm font-medium text-slate-500 mb-1">
                        Data rozpoczęcia
                      </dt>
                      <dd className="text-slate-800 font-semibold">
                        {new Date(project.startDate).toLocaleDateString(
                          "pl-PL",
                        )}
                      </dd>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <dt className="text-sm font-medium text-slate-500 mb-1">
                        Data zakończenia
                      </dt>
                      <dd className="text-slate-800 font-semibold">
                        {new Date(project.endDate).toLocaleDateString("pl-PL")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Opis
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
