"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import { DataTable } from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import { useRefreshList } from "@/hooks/useRefreshList";
import { useDeleteVacation } from "@/hooks/vacations/useDeleteVacation";
import { VacationAddModal } from "./VacationAddModal";
import { VacationEditModal } from "./VacationEditModal";
import { VacationStatusBadge } from "./VacationStatusBadge";

export interface Vacation {
  id: number;
  employeeName: string;
  vacationType: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

interface VacationsViewProps {
  initialVacations: Vacation[];
  availableEmployees: { label: string; value: number | string }[];
  availableTypes: string[];
  availableStatuses: string[];
}

export function VacationsView({
  initialVacations,
  availableEmployees,
  availableTypes,
  availableStatuses,
}: VacationsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Wszystkie");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");
  const [vacations, setVacations] = useState(initialVacations);
  const [filteredVacations, setFilteredVacations] = useState(initialVacations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);

  const { isRefreshing, refreshList, refreshListWithToast } = useRefreshList<
    Vacation[]
  >({
    apiUrl: "/api/vacations",
  });

  const { deleteVacation } = useDeleteVacation();

  const handleRefresh = async () => {
    const refreshedData = await refreshListWithToast();
    if (refreshedData) {
      setVacations(refreshedData);
    }
  };

  const handleDelete = async (vacation: Vacation) => {
    try {
      await deleteVacation(vacation);
      // Refresh the list after successful deletion
      const refreshedData = await refreshList();
      if (refreshedData) {
        setVacations(refreshedData);
      }
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Failed to delete vacation:", error);
    }
  };

  useEffect(() => {
    let filtered = vacations;

    if (selectedType !== "Wszystkie") {
      filtered = filtered.filter((v) => v.vacationType === selectedType);
    }

    if (selectedStatus !== "Wszystkie") {
      filtered = filtered.filter((v) => v.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((v) =>
        v.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredVacations(filtered);
  }, [searchTerm, selectedType, selectedStatus, vacations]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = async (shouldRefresh?: boolean) => {
    setIsAddModalOpen(false);
    // Refresh the list if vacation was added
    if (shouldRefresh) {
      const refreshedData = await refreshList();
      if (refreshedData) {
        setVacations(refreshedData);
      }
    }
  };

  const handleOpenEditModal = (vacation: Vacation) => {
    setEditingVacation(vacation);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = async (shouldRefresh?: boolean) => {
    setIsEditModalOpen(false);
    setEditingVacation(null);
    // Refresh the list if vacation was updated
    if (shouldRefresh) {
      const refreshedData = await refreshList();
      if (refreshedData) {
        setVacations(refreshedData);
      }
    }
  };

  return (
    <>
      {isAddModalOpen && (
        <VacationAddModal
          onClose={handleCloseAddModal}
          availableEmployees={availableEmployees}
          availableTypes={availableTypes}
        />
      )}

      {isEditModalOpen && editingVacation && (
        <VacationEditModal
          vacation={editingVacation}
          onClose={handleCloseEditModal}
          availableEmployees={availableEmployees}
          availableTypes={availableTypes}
          availableStatuses={availableStatuses}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          className="w-full md:w-auto"
        >
          <FaPlus />
          <span>Złóż wniosek</span>
        </Button>
        <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />

        <div className="relative grow w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <CustomInput
            type="text"
            name="searchEmployee"
            placeholder="Szukaj po imieniu i nazwisku..."
            className="pl-10"
            hideLabel
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CustomSelect
          name="typeFilter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          hideLabel
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-full md:w-auto"
          placeholder="Wszystkie typy"
          options={[
            { label: "Wszystkie typy", value: "Wszystkie" },
            ...availableTypes.map((type) => ({
              label: type,
              value: type,
            })),
          ]}
        />
        <CustomSelect
          name="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          hideLabel
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-full md:w-auto"
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
        data={filteredVacations}
        keyExtractor={(item) => item.id}
        emptyMessage="Nie znaleziono wniosków urlopowych."
        columns={[
          {
            key: "employeeName",
            header: "Imię i nazwisko",
            className: "p-4 text-gray-800 font-medium",
            headerClassName: "p-4",
          },
          {
            key: "vacationType",
            header: "Typ nieobecności",
            className: "p-4 text-gray-700",
            headerClassName: "p-4",
          },
          {
            key: "startDate",
            header: "Data rozpoczęcia",
            className: "p-4 text-gray-700 text-center",
            headerClassName: "p-4 text-center",
          },
          {
            key: "endDate",
            header: "Data zakończenia",
            className: "p-4 text-gray-700 text-center",
            headerClassName: "p-4 text-center",
          },
          {
            key: "daysCount",
            header: "Liczba dni",
            render: (item) => {
              const start = new Date(item.startDate);
              const end = new Date(item.endDate);
              const days =
                !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
                  ? Math.max(
                      1,
                      Math.ceil(
                        (end.getTime() - start.getTime()) /
                          (1000 * 60 * 60 * 24),
                      ) + 1,
                    )
                  : "-";
              return (
                <span title={`${item.startDate} – ${item.endDate}`}>
                  {days}
                </span>
              );
            },
            className: "p-4 text-center text-gray-700",
            headerClassName: "p-4 text-center",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <VacationStatusBadge status={item.status} />,
            className: "p-4",
            headerClassName: "p-4",
          },
        ]}
        actions={[
          {
            icon: <FaEdit size={16} />,
            label: "Edytuj",
            onClick: (item) => handleOpenEditModal(item),
            variant: "blue",
          },
          {
            icon: <FaTrash size={16} />,
            label: "Usuń",
            onClick: (item) => handleDelete(item),
            variant: "red",
          },
        ]}
      />
    </>
  );
}
