"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaInfo, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import {
  DataTable,
  type TableAction,
  type TableColumn,
} from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import type { ProjectListItem } from "@/dataBase/query/projects/listProjectsFromDb";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useRefreshList } from "@/hooks/useRefreshList";
import type { Project, ProjectsViewProps } from "@/types/ProjectsTypes";
import { mapProjectData } from "@/utils/mapProjectData";
import { ProgressBar } from "./ProgressBar";
import { ProjectAddModal } from "./ProjectAddModal";
import { ProjectDetailsView } from "./ProjectDetailsView";
import { ProjectEditModal } from "./ProjectEditModal";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectsView({
  initialProjects,
  availableStatuses,
  allUsers,
}: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");
  const [projects, setProjects] = useState(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const { isRefreshing, refreshList, refreshListWithToast } = useRefreshList<
    ProjectListItem[],
    Project[]
  >({
    apiUrl: "/api/projects",
    mapResponseData: (data) => mapProjectData(data),
  });

  // Manual refresh handler
  const handleRefreshProjects = async () => {
    const data = await refreshListWithToast();
    if (data) setProjects(data);
  };

  // Silent refresh for modal actions
  const handleSilentRefreshProjects = async () => {
    const data = await refreshList();
    if (data) setProjects(data);
  };

  const { deleteProject } = useDeleteProject();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let filteredList = projects;

    if (selectedStatus !== "Wszystkie") {
      filteredList = filteredList.filter((p) => p.status === selectedStatus);
    }

    if (searchTerm) {
      filteredList = filteredList.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.manager?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProjects(filteredList);
  }, [searchTerm, selectedStatus, projects]);

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(value);
  };

  const handleBackFromDetails = async () => {
    setSelectedProject(null);
    await handleSilentRefreshProjects();
  };

  if (selectedProject) {
    return (
      <ProjectDetailsView
        project={selectedProject}
        allUsers={allUsers}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <>
      {isEditModalOpen && editingProject && (
        <ProjectEditModal
          project={editingProject}
          onClose={handleCloseEditModal}
          availableStatuses={availableStatuses}
          onProjectChange={handleSilentRefreshProjects}
        />
      )}

      {isAddModalOpen && (
        <ProjectAddModal
          onClose={handleCloseAddModal}
          availableStatuses={availableStatuses}
          onProjectChange={handleSilentRefreshProjects}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          className="w-full md:w-auto"
        >
          <FaPlus />
          <span>Dodaj projekt</span>
        </Button>

        <RefreshButton
          onClick={handleRefreshProjects}
          isRefreshing={isRefreshing}
          title="Odśwież listę projektów"
        />

        <div className="relative grow w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <CustomInput
            type="text"
            name="searchProjects"
            placeholder="Szukaj po nazwie lub kierowniku..."
            className="pl-10"
            hideLabel
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CustomSelect
          name="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          hideLabel
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-50"
          placeholder="Wszystkie statusy"
          options={[
            { label: "Wszystkie statusy", value: "Wszystkie" },
            ...availableStatuses.map((status) => ({
              label: status,
              value: status,
            })),
          ]}
        />
      </div>

      <DataTable
        data={filteredProjects}
        keyExtractor={(project) => project.id}
        emptyMessage="Nie znaleziono projektów pasujących do kryteriów."
        columns={
          [
            {
              key: "name",
              header: "Nazwa",
              width: "w-64",
              className: "p-4 text-gray-800 font-medium truncate",
              headerClassName: "p-4",
            },
            {
              key: "status",
              header: "Status",
              width: "w-40",
              render: (project) => (
                <ProjectStatusBadge
                  status={project.status}
                  className="min-w-[150px]"
                />
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "manager",
              header: "Kierownik",
              width: "w-48",
              render: (project) => (
                <span className="text-gray-700">
                  {project.manager || "Nie przypisano"}
                </span>
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "progress",
              header: "Postęp",
              width: "w-48",
              render: (project) => <ProgressBar progress={project.progress} />,
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "budget",
              header: "Budżet",
              width: "w-32",
              render: (project) => (
                <span className="text-gray-700">
                  {formatCurrency(project.budget)}
                </span>
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
          ] as TableColumn<Project>[]
        }
        actions={
          [
            {
              icon: <FaInfo size={16} />,
              label: "Szczegóły",
              onClick: (project) => {
                setSelectedProject(project);
              },
              variant: "yellow",
            },
            {
              icon: <FaEdit size={16} />,
              label: "Edytuj",
              onClick: (project) => handleOpenEditModal(project),
              variant: "blue",
            },
            {
              icon: <FaTrash size={16} />,
              label: "Usuń",
              onClick: async (project) => {
                await deleteProject(project);
                await handleSilentRefreshProjects();
              },
              variant: "red",
            },
          ] as TableAction<Project>[]
        }
      />
    </>
  );
}
