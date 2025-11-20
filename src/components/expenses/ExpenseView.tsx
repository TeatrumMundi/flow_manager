"use client";

import { useEffect, useState } from "react";
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
import { ExpenseAddModal } from "./ExpenseAddModal";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { ExpensesSummary } from "./ExpensesSummary";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";

export interface Expense {
  id: number;
  name: string;
  category: string;
  projectName: string;
  amount: number;
  date: string;
  status: string;
}

interface ExpensesViewProps {
  initialExpenses: Expense[];
  availableCategories: string[];
  availableProjects: string[];
}

export function ExpensesView({
                               initialExpenses,
                               availableCategories,
                               availableProjects,
                             }: ExpensesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [selectedProject, setSelectedProject] = useState("Wszystkie");
  const [filteredExpenses, setFilteredExpenses] = useState(initialExpenses);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    let expenses = initialExpenses;

    if (selectedCategory !== "Wszystkie") {
      expenses = expenses.filter((e) => e.category === selectedCategory);
    }

    if (selectedProject !== "Wszystkie") {
      expenses = expenses.filter((e) => e.projectName === selectedProject);
    }

    if (searchTerm) {
      expenses = expenses.filter((e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredExpenses(expenses);
  }, [searchTerm, selectedCategory, selectedProject, initialExpenses]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(value);
  };

  return (
      <div className="flex flex-col gap-8">
        {isAddModalOpen && (
            <ExpenseAddModal
                onClose={handleCloseAddModal}
                availableCategories={availableCategories}
                availableProjects={availableProjects}
            />
        )}

        {isEditModalOpen && editingExpense && (
            <ExpenseEditModal
                expense={editingExpense}
                onClose={handleCloseEditModal}
                availableCategories={availableCategories}
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

          <div className="flex gap-2 w-full md:w-auto">
            <CustomSelect
                name="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                hideLabel
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-full"
                placeholder="Kategorie"
                options={[
                  { label: "Wszystkie kategorie", value: "Wszystkie" },
                  ...availableCategories.map((cat) => ({
                    label: cat,
                    value: cat,
                  })),
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
                  ...availableProjects.map((proj) => ({
                    label: proj,
                    value: proj,
                  })),
                ]}
            />
          </div>
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
                  className: "p-4 text-gray-800 font-medium",
                  headerClassName: "p-4",
                },
                {
                  key: "category",
                  header: "Kategoria",
                  className: "p-4 text-gray-700",
                  headerClassName: "p-4",
                },
                {
                  key: "projectName",
                  header: "Projekt",
                  className: "p-4 text-gray-700",
                  headerClassName: "p-4",
                },
                {
                  key: "amount",
                  header: "Kwota",
                  className: "p-4 text-gray-800 font-semibold",
                  headerClassName: "p-4",
                  render: (item) => formatCurrency(item.amount),
                },
                {
                  key: "date",
                  header: "Data",
                  className: "p-4 text-gray-700",
                  headerClassName: "p-4",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => <ExpenseStatusBadge status={item.status} />,
                  className: "p-4",
                  headerClassName: "p-4",
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
                  onClick: () => alert("Usuwanie (do implementacji)"),
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