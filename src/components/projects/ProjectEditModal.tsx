"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  manager?: string;
  progress: number;
  budget: number;
  startDate?: string | null;
  endDate?: string | null;
}

interface ProjectEditModalProps {
  project: Project;
  onClose: () => void;
  availableStatuses: string[];
  onProjectChange?: () => void;
}

export function ProjectEditModal({
  project,
  onClose,
  availableStatuses,
  onProjectChange,
}: ProjectEditModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    status: project.status || availableStatuses[0] || "",
    progress: project.progress?.toString() || "0",
    budget: project.budget?.toString() || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const savePromise = async () => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          status: formData.status || null,
          progress: formData.progress ? Number(formData.progress) : 0,
          budget: formData.budget ? formData.budget : null,
          startDate: formData.startDate?.trim() || null,
          endDate: formData.endDate?.trim() || null,
          isArchived: formData.status === "Zarchiwizowany",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      return response.json();
    };

    try {
      await toast.promise(savePromise(), {
        loading: `Aktualizowanie projektu: ${formData.name ?? "Nieznany projekt"}...`,
        success: `Zaktualizowano projekt: ${formData.name ?? "Nieznany projekt"}!`,
        error: (err) => `Błąd: ${err.message}`,
      });

      if (onProjectChange) onProjectChange();
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title="Edytuj projekt"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Postęp (%)"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
          <CustomInput
            label="Budżet (PLN)"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            value={formData.budget}
            onChange={handleChange}
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
