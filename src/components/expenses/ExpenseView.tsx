"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import {
  DataTable,
  type TableAction,
  type TableColumn,
} from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExpenseAddModal } from "./ExpenseAddModal";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { ExpensesSummary } from "./ExpensesSummary";

export interface Expense {
  id: number;
  name: string;
  category: string;
  categoryId?: number | null;
  projectName: string;
  projectId?: number | null;
  amount: number;
  date: string;
  status: string;
  statusId?: number | null;
}

interface ExpensesViewProps {
  initialExpenses: Expense[];
  availableCategories: { label: string; value: number }[];
  availableStatuses: { label: string; value: number }[];
  availableProjects: { label: string; value: number }[];
}

export function ExpensesView({
  initialExpenses,
  availableCategories,
  availableStatuses,
  availableProjects,
}: ExpensesViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [selectedProject, setSelectedProject] = useState("Wszystkie");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(initialExpenses);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Update local state when props change (after router.refresh())
  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  useEffect(() => {
    let filtered = expenses;

    if (selectedCategory !== "Wszystkie") {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    if (selectedProject !== "Wszystkie") {
      filtered = filtered.filter((e) => e.projectName === selectedProject);
    }

    if (searchTerm) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredExpenses(filtered);
  }, [searchTerm, selectedCategory, selectedProject, expenses]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = (shouldRefresh?: boolean) => {
    setIsAddModalOpen(false);
    if (shouldRefresh) {
      router.refresh();
    }
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = (shouldRefresh?: boolean) => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
    if (shouldRefresh) {
      router.refresh();
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    const deletePromise = async () => {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to delete expense");
      }

      return data;
    };

    await toast.promise(deletePromise(), {
      loading: "Usuwanie wydatku...",
      success: "Wydatek został usunięty!",
      error: (err) => `Błąd: ${err.message}`,
    });

    router.refresh();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <ExpenseAddModal
          onClose={handleCloseAddModal}
          availableCategories={availableCategories}
          availableStatuses={availableStatuses}
          availableProjects={availableProjects}
        />
      )}

      {isEditModalOpen && editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          onClose={handleCloseEditModal}
          availableCategories={availableCategories}
          availableStatuses={availableStatuses}
          availableProjects={availableProjects}
        />
      )}

      {/* Pasek narzędzi */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          className="w-full md:w-auto"
        >
          <FaPlus />
          <span>Dodaj wydatek</span>
        </Button>
        <RefreshButton onClick={() => {}} isRefreshing={false} />

        <div className="relative grow w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <CustomInput
            type="text"
            name="searchExpense"
            placeholder="Szukaj po nazwie wydatku..."
            className="pl-10"
            hideLabel
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CustomSelect
          name="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          hideLabel
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-full"
          placeholder="Kategorie"
          options={[
            { label: "Wszystkie kategorie", value: "Wszystkie" },
            ...availableCategories,
          ]}
        />
        <CustomSelect
          name="projectFilter"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          hideLabel
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-full"
          placeholder="Projekty"
          options={[
            { label: "Wszystkie projekty", value: "Wszystkie" },
            ...availableProjects,
          ]}
        />
      </div>

      {/* Tabela */}
      <DataTable
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        emptyMessage="Nie znaleziono wydatków."
        columns={
          [
            {
              key: "name",
              header: "Nazwa",
              className: "p-4 text-gray-800 font-medium w-50",
              headerClassName: "p-4 w-50",
            },
            {
              key: "category",
              header: "Kategoria",
              className: "p-4 text-gray-700 w-40",
              headerClassName: "p-4 w-40",
            },
            {
              key: "projectName",
              header: "Projekt",
              className: "p-4 text-gray-700 w-48",
              headerClassName: "p-4 w-48",
            },
            {
              key: "amount",
              header: "Kwota",
              className: "p-4 text-gray-800 font-semibold w-32",
              headerClassName: "p-4 w-32",
              render: (item) => formatCurrency(item.amount),
            },
            {
              key: "date",
              header: "Data",
              className: "p-4 text-gray-700 w-32",
              headerClassName: "p-4 w-32",
            },
            {
              key: "status",
              header: "Status",
              render: (item) => (
                <StatusBadge status={item.status} type="expense" />
              ),
              className: "p-4 w-32",
              headerClassName: "p-4 w-32",
            },
          ] as TableColumn<Expense>[]
        }
        actions={
          [
            {
              icon: <FaEdit size={16} />,
              label: "Edytuj",
              onClick: (item) => handleOpenEditModal(item),
              variant: "blue",
            },
            {
              icon: <FaTrash size={16} />,
              label: "Usuń",
              onClick: (item) => handleDeleteExpense(item),
              variant: "red",
            },
          ] as TableAction<Expense>[]
        }
      />

      {/* Podsumowanie (teraz na dole, pod tabelą) */}
      <ExpensesSummary expenses={filteredExpenses} />
    </div>
  );
}
