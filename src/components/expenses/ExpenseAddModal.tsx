"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface ExpenseAddModalProps {
  onClose: (shouldRefresh?: boolean) => void;
  availableCategories: { label: string; value: number }[];
  availableStatuses: { label: string; value: number }[];
  availableProjects: { label: string; value: number }[];
}

export function ExpenseAddModal({
  onClose,
  availableCategories,
  availableStatuses,
  availableProjects,
}: ExpenseAddModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: availableCategories[0]?.value || 0,
    projectId: availableProjects[0]?.value || 0,
    statusId: availableStatuses[0]?.value || 0,
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    // Convert to number for ID fields
    if (name === "categoryId" || name === "projectId" || name === "statusId") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const savePromise = async () => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          categoryId: formData.categoryId,
          projectId: formData.projectId || null,
          statusId: formData.statusId || null,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to create expense");
      }

      return data;
    };

    await toast.promise(savePromise(), {
      loading: "Dodawanie wydatku...",
      success: "Wydatek został dodany!",
      error: (err) => `Błąd: ${err.message}`,
    });

    onClose(true);
  };

  return (
    <CustomModal
      isOpen={true}
      title="Dodaj nowy wydatek"
      onClose={() => onClose()}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Nazwa wydatku *"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            label="Kategoria *"
            name="categoryId"
            value={formData.categoryId.toString()}
            onChange={handleChange}
            options={availableCategories}
            required
          />
          <CustomSelect
            label="Projekt"
            name="projectId"
            value={formData.projectId.toString()}
            onChange={handleChange}
            options={availableProjects}
          />
          <CustomSelect
            label="Status *"
            name="statusId"
            value={formData.statusId.toString()}
            onChange={handleChange}
            options={availableStatuses}
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

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary"
          >
            Anuluj
          </Button>
          <Button type="submit" variant="primary">
            Dodaj wydatek
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
