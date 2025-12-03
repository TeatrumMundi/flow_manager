"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { TableAction } from "@/components/common/CustomTable";
import { DataTable } from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useRefreshList } from "@/hooks/useRefreshList";
import { useDeleteVacation } from "@/hooks/vacations/useDeleteVacation";
import { VacationAddModal } from "./VacationAddModal";
import { VacationEditModal } from "./VacationEditModal";

export interface Vacation {
  id: number;
  visibleUserId?: number;
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
  hasFullAccess?: boolean;
  currentUserId?: number;
}

export function VacationsView({
  initialVacations,
  availableEmployees,
  availableTypes,
  availableStatuses,
  hasFullAccess = false,
  currentUserId,
}: VacationsViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Wszystkie");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");
  const [vacations, setVacations] = useState(initialVacations);
  const [filteredVacations, setFilteredVacations] = useState(initialVacations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);
  const [vacationToDelete, setVacationToDelete] = useState<Vacation | null>(
    null,
  );

  // Build API URL with userId filter for non-admin users
  const apiUrl = hasFullAccess
    ? "/api/vacations"
    : `/api/vacations?userId=${currentUserId}`;

  const { isRefreshing, refreshList, refreshListWithToast } = useRefreshList<
    Vacation[]
  >({
    apiUrl,
  });

  const { deleteVacation } = useDeleteVacation();

  const handleRefresh = async () => {
    const refreshedData = await refreshListWithToast();
    if (refreshedData) {
      setVacations(refreshedData);
    }
  };

  const handleOpenDeleteModal = (vacation: Vacation) => {
    setVacationToDelete(vacation);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVacationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!vacationToDelete) return;
    try {
      await deleteVacation(vacationToDelete);
      const refreshedData = await refreshList();
      if (refreshedData) {
        setVacations(refreshedData);
      }
    } catch (error) {
      console.error("Failed to delete vacation:", error);
    }
    handleCloseDeleteModal();
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

  // Get actions for a specific vacation item
  const getVacationActions = (vacation: Vacation): TableAction<Vacation>[] => {
    // Statuses that lock the vacation from being edited by regular users
    const lockedStatuses = ["Zaakceptowany", "Odrzucony"];
    const isLocked = lockedStatuses.includes(vacation.status);

    // Regular users cannot edit/delete locked vacations
    // Admins can always edit/delete
    const canEdit =
      hasFullAccess || (vacation.visibleUserId === currentUserId && !isLocked);

    if (!canEdit) {
      return [];
    }

    return [
      {
        icon: <FaEdit size={16} />,
        label: "Edytuj",
        onClick: (item) => handleOpenEditModal(item),
        variant: "blue",
      },
      {
        icon: <FaTrash size={16} />,
        label: "Usuń",
        onClick: (item) => handleOpenDeleteModal(item),
        variant: "red",
      },
    ];
  };

  return (
    <>
      {isAddModalOpen && (
        <VacationAddModal
          onClose={handleCloseAddModal}
          availableEmployees={availableEmployees}
          availableTypes={availableTypes}
          hasFullAccess={hasFullAccess}
          currentUserId={currentUserId}
        />
      )}

      {isEditModalOpen && editingVacation && (
        <VacationEditModal
          vacation={editingVacation}
          onClose={handleCloseEditModal}
          availableEmployees={availableEmployees}
          availableTypes={availableTypes}
          availableStatuses={availableStatuses}
          hasFullAccess={hasFullAccess}
          currentUserId={currentUserId}
        />
      )}

      {isDeleteModalOpen && vacationToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Usuń wniosek urlopowy"
          itemName={`${vacationToDelete.employeeName} (${vacationToDelete.startDate} - ${vacationToDelete.endDate})`}
          description="Czy na pewno chcesz usunąć ten wniosek urlopowy?"
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
            render: (item) => (
              <StatusBadge status={item.status} type="vacation" />
            ),
            className: "p-4",
            headerClassName: "p-4",
          },
        ]}
        getActions={getVacationActions}
      />
    </>
  );
}
