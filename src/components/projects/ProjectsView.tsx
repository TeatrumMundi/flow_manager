"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FaEdit,
    FaInfo,
    FaPlus,
    FaSearch,
    FaTrash,
} from "react-icons/fa";
import { Button } from "@/app/components/Button";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProgressBar } from "./ProgressBar";

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

            <div className="overflow-x-auto bg-white/50 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Nazwa</th>
                        <th className="p-4 font-semibold text-gray-600">Status</th>
                        <th className="p-4 font-semibold text-gray-600">Kierownik</th>
                        <th className="p-4 font-semibold text-gray-600">Postęp</th>
                        <th className="p-4 font-semibold text-gray-600">Budżet</th>
                        <th className="p-4 font-semibold text-gray-600">Szczegóły</th>
                        <th className="p-4 font-semibold text-gray-600">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProjects.map((project) => (
                        <tr
                            key={project.id}
                            className="border-t border-gray-200 hover:bg-gray-50/50"
                        >
                            <td className="p-4 text-gray-800 font-medium">
                                {project.name}
                            </td>
                            <td className="p-4">
                                <ProjectStatusBadge status={project.status} />
                            </td>
                            <td className="p-4 text-gray-700">{project.manager}</td>
                            <td className="p-4">
                                <ProgressBar progress={project.progress} />
                            </td>
                            <td className="p-4 text-gray-700">
                                {formatCurrency(project.budget)}
                            </td>
                            <td className="p-4">
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="p-2 inline-flex rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors cursor-pointer border border-yellow-200"
                                >
                                    <FaInfo size={16} />
                                </Link>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors cursor-pointer border border-blue-200"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer border border-red-200"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {filteredProjects.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    Nie znaleziono projektów pasujących do kryteriów.
                </p>
            )}
        </>
    );
}
