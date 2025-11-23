"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { Expense } from "./ExpenseView";

interface ExpenseEditModalProps {
  expense: Expense;
  onClose: () => void;
  availableCategories: string[];
  availableProjects: string[];
}

export function ExpenseEditModal({
                                   expense,
                                   onClose,
                                   availableCategories,
                                   availableProjects,
                                 }: ExpenseEditModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: expense.name || "",
    category: expense.category || availableCategories[0] || "",
    projectName: expense.projectName || availableProjects[0] || "",
    amount: expense.amount.toString() || "",
    date: expense.date || "",
    status: expense.status || "Oczekujący",
  });

  const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const savePromise = new Promise((resolve) => {
      console.log("Aktualizacja wydatku:", formData);
      setTimeout(resolve, 1000);
    });

    await toast.promise(savePromise, {
      loading: "Aktualizacja wydatku...",
      success: "Wydatek został zaktualizowany!",
      error: "Błąd podczas aktualizacji.",
    });

    onClose();
    router.refresh();
  };

  const statuses = ["Oczekujący", "Zatwierdzony", "Odrzucony"];

  return (
      <CustomModal
          isOpen={true}
          onClose={onClose}
          title="Edytuj wydatek"
          size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
              label="Nazwa wydatku *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
                label="Kategoria *"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={availableCategories}
                required
            />
            <CustomSelect
                label="Projekt *"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                options={availableProjects}
                required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
                label="Kwota (PLN) *"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
            />
            <CustomInput
                label="Data *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
          </div>

          <CustomSelect
              label="Status *"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statuses}
              required
          />

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" onClick={onClose} variant="secondary">
              Anuluj
            </Button>
            <Button type="submit" variant="primary">
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </CustomModal>
  );
}