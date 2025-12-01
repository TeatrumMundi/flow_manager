"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { Button } from "@/components/common/CustomButton";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { TableAction, TableColumn } from "@/components/common/CustomTable";
import { DataTable } from "@/components/common/CustomTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { ProjectAssignmentListItem } from "@/dataBase/query/projects/listProjectAssignmentsFromDb";
import type { ProjectTaskListItem } from "@/dataBase/query/tasks/listTasksByProjectFromDb";
import type { UserListItem } from "@/dataBase/query/users/listUsersFromDb";
import { ProgressBar } from "./ProgressBar";
import { TaskAddModal } from "./TaskAddModal";
import { TaskEditModal } from "./TaskEditModal";

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
  onBack: (() => void) | null;
}

export function ProjectDetailsView({
  project,
  allUsers,
  onBack,
}: ProjectDetailsViewProps) {
  const [assignments, setAssignments] = useState<ProjectAssignmentListItem[]>(
    [],
  );
  const [tasks, setTasks] = useState<ProjectTaskListItem[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState(PROJECT_ROLES[0]);
  const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTaskListItem | null>(
    null,
  );

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

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${project.id}/tasks`);
        const data = await response.json();
        if (data.ok) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchAssignments();
    fetchTasks();
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

  const handleRefreshTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/tasks`);
      const data = await response.json();
      if (data.ok) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  const handleDeleteTask = async (task: ProjectTaskListItem) => {
    const deletePromise = async () => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      return data;
    };

    await toast.promise(deletePromise(), {
      loading: `Usuwanie zadania: ${task.title}...`,
      success: `Zadanie usunięte!`,
      error: (err) => `Błąd: ${err.message}`,
    });

    await handleRefreshTasks();
  };

  const handleEditTask = (task: ProjectTaskListItem) => {
    setEditingTask(task);
  };

  // Define table columns for tasks
  const taskColumns: TableColumn<ProjectTaskListItem>[] = [
    {
      key: "title",
      header: "Nazwa",
      render: (task) => (
        <span className="text-slate-800 font-medium">
          {task.title || "Bez tytułu"}
        </span>
      ),
    },
    {
      key: "assignedToName",
      header: "Przypisany",
      render: (task) =>
        task.assignedToName ? (
          <span className="text-slate-600">{task.assignedToName}</span>
        ) : (
          <span className="text-slate-400 italic">Nieprzypisane</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (task) => (
        <StatusBadge status={task.status || "Do zrobienia"} type="project" />
      ),
    },
    {
      key: "estimatedHours",
      header: "Szacowane godziny",
      align: "right",
      render: (task) =>
        task.estimatedHours ? (
          <span className="text-slate-600 font-mono">
            {task.estimatedHours}h
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
  ];

  // Define table actions for tasks
  const taskActions: TableAction<ProjectTaskListItem>[] = [
    {
      icon: <FaEdit size={16} />,
      label: "Edytuj zadanie",
      onClick: handleEditTask,
      variant: "blue",
    },
    {
      icon: <FaTrash size={16} />,
      label: "Usuń zadanie",
      onClick: handleDeleteTask,
      variant: "red",
    },
  ];

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
    // Check if user is assigned to any tasks
    const userTasks = tasks.filter((task) => task.assignedToId === userId);

    if (userTasks.length > 0) {
      const taskTitles = userTasks.map((task) => `"${task.title}"`).join(", ");
      toast.error(
        `Nie można usunąć ${userName} z projektu. Użytkownik jest przypisany do ${userTasks.length} zadań: ${taskTitles}. Najpierw usuń lub zmień przypisanie tych zadań.`,
        {
          duration: 6000,
        },
      );
      return;
    }

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
          {onBack && (
            <BackToDashboardButton className="" onClick={onBack}>
              Powrót
            </BackToDashboardButton>
          )}
          <div>
            <p className="text-sm text-slate-500">Projekt</p>
            <h1 className="text-2xl font-bold text-slate-800">
              {project.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-600">Status:</p>
          <StatusBadge status={project.status} type="project" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Assigned employees tile */}
          <div className="bg-white rounded-xl border border-slate-200 flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Przypisani pracownicy ({assignments.length})
              </h2>
            </div>
            {isLoadingAssignments ? (
              <p className="text-slate-500 p-6">Ładowanie...</p>
            ) : (
              <div className="flex flex-col flex-1">
                {assignments.length > 0 && (
                  <ul className="divide-y divide-slate-200 flex-1 overflow-y-auto">
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
                <div className="p-6 bg-slate-50/70 rounded-b-xl mt-auto border-t border-slate-200">
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
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col">
          {/* Details tile */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 flex-1 flex flex-col">
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

      {/* Tasks tile - Full width below */}
      <div className="bg-white rounded-xl border border-slate-200 mt-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Zadania w projekcie ({tasks.length})
          </h2>
          <Button
            variant="primary"
            onClick={() => setIsTaskAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FaPlus />
            <span>Dodaj zadanie</span>
          </Button>
        </div>
        {isLoadingTasks ? (
          <p className="text-slate-500 p-6">Ładowanie zadań...</p>
        ) : tasks.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500 mb-4">Brak zadań w tym projekcie.</p>
            <Button
              variant="primary"
              onClick={() => setIsTaskAddModalOpen(true)}
              className="mx-auto"
            >
              <FaPlus />
              <span>Dodaj pierwsze zadanie</span>
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <DataTable
              data={tasks}
              columns={taskColumns}
              actions={taskActions}
              keyExtractor={(task) => task.id}
              emptyMessage="Brak zadań w tym projekcie."
            />
          </div>
        )}
      </div>

      {/* Task Add Modal */}
      {isTaskAddModalOpen && (
        <TaskAddModal
          projectId={project.id}
          onClose={(shouldRefresh) => {
            setIsTaskAddModalOpen(false);
            if (shouldRefresh) {
              handleRefreshTasks();
            }
          }}
          availableUsers={assignments.map((assignment) => ({
            label:
              `${assignment.firstName || ""} ${assignment.lastName || ""} (${assignment.email})`.trim(),
            value: assignment.userId,
          }))}
        />
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={(shouldRefresh) => {
            setEditingTask(null);
            if (shouldRefresh) {
              handleRefreshTasks();
            }
          }}
          availableUsers={assignments.map((assignment) => ({
            label:
              `${assignment.firstName || ""} ${assignment.lastName || ""} (${assignment.email})`.trim(),
            value: assignment.userId,
          }))}
        />
      )}
    </div>
  );
}
