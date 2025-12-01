"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

const TASK_STATUSES = [
  "Do zrobienia",
  "W trakcie",
  "W przeglązie",
  "Ukończone",
  "Zablokowane",
  "Anulowane",
];

interface TaskAddModalProps {
  projectId: number;
  onClose: (shouldRefresh?: boolean) => void;
  availableUsers: { label: string; value: number | string }[];
}

export function TaskAddModal({
  projectId,
  onClose,
  availableUsers,
}: TaskAddModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedToId: "",
    status: "Do zrobienia",
    estimatedHours: "",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const savePromise = async () => {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          assignedToId: formData.assignedToId
            ? Number(formData.assignedToId)
            : null,
          status: formData.status,
          estimatedHours: formData.estimatedHours || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      return response.json();
    };

    try {
      await toast.promise(savePromise(), {
        loading: `Tworzenie zadania: ${formData.title}...`,
        success: `Utworzono zadanie: ${formData.title}!`,
        error: (err) => `Błąd: ${err.message}`,
      });

      onClose(true);
      router.refresh();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={() => onClose(false)}
      title="Dodaj nowe zadanie"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Tytuł zadania *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="np. Implementacja logowania"
          required
        />

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Opis zadania
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Szczegółowy opis zadania..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            label="Przypisz do"
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleChange}
            options={[{ label: "Nieprzypisane", value: "" }, ...availableUsers]}
          />
          <CustomSelect
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={TASK_STATUSES.map((status) => ({
              label: status,
              value: status,
            }))}
            required
          />
        </div>

        <CustomInput
          label="Szacowane godziny"
          name="estimatedHours"
          type="number"
          step="0.5"
          min="0"
          value={formData.estimatedHours}
          onChange={handleChange}
          placeholder="np. 8.5"
        />

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary"
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." : "Dodaj zadanie"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
