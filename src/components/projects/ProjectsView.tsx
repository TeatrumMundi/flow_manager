"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaInfo, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/Button";
import {
  DataTable,
  type TableAction,
  type TableColumn,
} from "@/components/common/DataTable";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);

  useEffect(() => {
    let projects = initialProjects;

    if (selectedStatus !== "Wszystkie") {
      projects = projects.filter((p) => p.status === selectedStatus);
    }

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
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
        <Button
          variant="primary"
          onClick={() => alert("Dodawanie projektu (do implementacji)")}
          className="whitespace-nowrap w-full md:w-auto"
        >
          <FaPlus className="mr-2" /> Dodaj projekt
        </Button>
        <div className="relative flex-grow w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj po nazwie lub kierowniku..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white w-full md:w-auto"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="Wszystkie">Wszystkie statusy</option>
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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
              className: "p-4 text-gray-800 font-medium",
              headerClassName: "p-4",
            },
            {
              key: "status",
              header: "Status",
              render: (project) => (
                <ProjectStatusBadge status={project.status} />
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "manager",
              header: "Kierownik",
              className: "p-4 text-gray-700",
              headerClassName: "p-4",
            },
            {
              key: "progress",
              header: "Postęp",
              render: (project) => <ProgressBar progress={project.progress} />,
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "budget",
              header: "Budżet",
              render: (project) => (
                <span className="text-gray-700">
                  {formatCurrency(project.budget)}
                </span>
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
            {
              key: "details",
              header: "Szczegóły",
              render: (project) => (
                <Link
                  href={`/projects/${project.id}`}
                  className="p-2 inline-flex rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors cursor-pointer border border-yellow-200"
                >
                  <FaInfo size={16} />
                </Link>
              ),
              headerClassName: "p-4",
              className: "p-4",
            },
          ] as TableColumn<Project>[]
        }
        actions={
          [
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
