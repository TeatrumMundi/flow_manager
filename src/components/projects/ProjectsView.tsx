"use client";

import { useRouter } from "next/navigation";
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
import { ProgressBar } from "./ProgressBar";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

interface Project {
  id: number;
  name: string;
  status: string;
  manager: string;
  progress: number;
  budget: number;
}

interface ProjectsViewProps {
  initialProjects: Project[];
  availableStatuses: string[];
}

export function ProjectsView({
  initialProjects,
  availableStatuses,
}: ProjectsViewProps) {
  const router = useRouter();

  // Filter state management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);

  // Apply filters whenever search term, status, or projects change
  useEffect(() => {
    let projects = initialProjects;

    // Filter by selected status
    if (selectedStatus !== "Wszystkie") {
      projects = projects.filter((p) => p.status === selectedStatus);
    }

    // Filter by search term (name or manager)
    if (searchTerm) {
      projects = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.manager.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProjects(projects);
  }, [searchTerm, selectedStatus, initialProjects]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(value);
  };

  return (
    <>
      {/* Toolbar with filters and actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
        {/* Add project button */}
        <Button
          variant="primary"
          onClick={() => alert("Dodawanie projektu (do implementacji)")}
          className="w-full md:w-auto"
        >
          <FaPlus />
          <span>Dodaj projekt</span>
        </Button>

        {/* Search input */}
        <div className="relative flex-grow w-full">
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

        {/* Status filter dropdown */}
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

      {/* Projects table */}
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
              width: "w-32",
              render: (project) => (
                <ProjectStatusBadge status={project.status} />
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "manager",
              header: "Kierownik",
              width: "w-48",
              className: "p-4 text-gray-700 truncate",
              headerClassName: "p-4",
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
                router.push(`/projects/${project.id}`);
              },
              variant: "yellow",
            },
            {
              icon: <FaEdit size={16} />,
              label: "Edytuj",
              onClick: () => alert("Edycja projektu (do implementacji)"),
              variant: "blue",
            },
            {
              icon: <FaTrash size={16} />,
              label: "Usuń",
              onClick: () => alert("Usuwanie projektu (do implementacji)"),
              variant: "red",
            },
          ] as TableAction<Project>[]
        }
      />
    </>
  );
}
