"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface ProjectAddModalProps {
  onClose: () => void;
  availableStatuses: string[];
  availableManagers: string[];
}

export function ProjectAddModal({
  onClose,
  availableStatuses,
  availableManagers,
}: ProjectAddModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: availableStatuses[0] || "Aktywny",
    manager: "",
    progress: "0",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const savePromise = async () => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          progress: formData.progress ? Number(formData.progress) : 0,
          budget: formData.budget ? formData.budget : null,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          isArchived: formData.status === "Zarchiwizowany",
          managerName: formData.manager || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      return response.json();
    };

    try {
      await toast.promise(savePromise(), {
        loading: `Tworzenie projektu: ${formData.name}...`,
        success: `Utworzono projekt: ${formData.name}!`,
        error: (err) => `Błąd: ${err.message}`,
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title="Dodaj nowy projekt"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Nazwa projektu *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Opis projektu"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={availableStatuses.map((status) => ({
              label: status,
              value: status,
            }))}
            required
          />
          <CustomInput
            label="Postęp (%)"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Budżet (PLN)"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            value={formData.budget}
            onChange={handleChange}
          />
          <CustomSelect
            label="Kierownik projektu"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            options={[
              { label: "Nie przypisano", value: "" },
              ...availableManagers.map((manager) => ({
                label: manager,
                value: manager,
              })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Data rozpoczęcia"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          <CustomInput
            label="Data zakończenia"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." : "Dodaj projekt"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
