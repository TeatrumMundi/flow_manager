"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { Button } from "@/components/common/CustomButton";
import { CustomSelect } from "@/components/common/CustomSelect";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import type { ProjectAssignmentListItem } from "@/dataBase/query/projects/listProjectAssignmentsFromDb";
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
      <div className="flex items-center justify-between mb-8">
        <BackToDashboardButton className="" onClick={onBack}>
          Powrót do projektów
        </BackToDashboardButton>
        <SectionTitleTile
          title={`Szczegóły projektu: ${project.name}`}
          className="bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-100 hover:text-purple-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks tile - displays list of project tasks with assigned workers */}
          <div className="bg-white/50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Zadania
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600">Nazwa</th>
                    <th className="p-3 font-semibold text-gray-600">
                      Przypisany pracownik
                    </th>
                    <th className="p-3 font-semibold text-gray-600">Status</th>
                    <th className="p-3 font-semibold text-gray-600">Godziny</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 hover:bg-gray-50/50"
                    >
                      <td className="p-3 text-gray-800 font-medium">
                        {task.name}
                      </td>
                      <td className="p-3 text-gray-700">{task.worker}</td>
                      <td className="p-3">
                        <ProjectStatusBadge status={task.status} />
                      </td>
                      <td className="p-3 text-gray-700">{task.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assigned employees tile - shows workers assigned to the project */}
          <div className="bg-white/50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Przypisani pracownicy ({assignments.length})
            </h2>
            {isLoadingAssignments ? (
              <p className="text-gray-500 py-4">Ładowanie...</p>
            ) : (
              <div className="space-y-4">
                {assignments.length === 0 ? (
                  <p className="text-gray-500 py-2">
                    Brak przypisanych pracowników do tego projektu
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <ul className="space-y-2">
                      {assignments.map((assignment) => (
                        <li
                          key={assignment.assignmentId}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-gray-800">
                              {assignment.firstName} {assignment.lastName}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({assignment.email})
                            </span>
                            {assignment.roleOnProject && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                {assignment.roleOnProject}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleRemoveUser(
                                assignment.userId,
                                `${assignment.firstName} ${assignment.lastName}`,
                              )
                            }
                            className="py-1 px-3"
                            title={
                              assignment.roleOnProject === "Manager"
                                ? "Usuń managera projektu"
                                : "Usuń z projektu"
                            }
                          >
                            <FaTrash size={14} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Separator */}
                <div className="border-t border-gray-300 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Przypisz nowego użytkownika
                  </h3>
                  {selectedRole === "Manager" && projectManager && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      <strong>Uwaga:</strong> Przypisanie nowego Managera
                      automatycznie usunie obecnego managera (
                      {projectManager.firstName} {projectManager.lastName}).
                    </div>
                  )}
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <CustomSelect
                        label="Użytkownik"
                        name="userId"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        searchable
                        options={[
                          { label: "Wybierz użytkownika", value: "" },
                          ...availableUsers.map((user) => ({
                            label:
                              `${user.firstName || ""} ${user.lastName || ""} (${user.email})`.trim(),
                            value: user.id,
                          })),
                        ]}
                      />
                    </div>
                    <div className="w-48">
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
                    >
                      <FaPlus className="mr-2" />
                      Przypisz
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Basic information tile - displays project status, progress, budget and manager */}
          <div className="bg-white/50 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Informacje podstawowe
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Postęp</p>
                <ProgressBar progress={project.progress} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Budżet</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(project.budget)}
                </p>
              </div>
              {managerName && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Kierownik projektu
                  </p>
                  <p className="text-gray-800 font-medium">{managerName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project description tile - shows detailed project description */}
          {project.description && (
            <div className="bg-white/50 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Opis projektu
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Timeline tile - displays project start and end dates */}
          {(project.startDate || project.endDate) && (
            <div className="bg-white/50 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Terminy
              </h3>
              <div className="space-y-3">
                {project.startDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Data rozpoczęcia
                    </p>
                    <p className="text-gray-800 font-medium">
                      {new Date(project.startDate).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {project.endDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Data zakończenia
                    </p>
                    <p className="text-gray-800 font-medium">
                      {new Date(project.endDate).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
