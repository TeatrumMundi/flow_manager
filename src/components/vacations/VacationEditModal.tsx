"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { Vacation } from "./VacationsView";

interface VacationEditModalProps {
  vacation: Vacation;
  onClose: (shouldRefresh?: boolean) => void;
  availableEmployees: { label: string; value: number | string }[];
  availableTypes: string[];
  availableStatuses: string[];
  hasFullAccess?: boolean;
  currentUserId?: number;
}

export function VacationEditModal({
  vacation,
  onClose,
  availableTypes,
  availableStatuses,
  hasFullAccess = false,
}: VacationEditModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeName: vacation.employeeName || "",
    vacationType: vacation.vacationType || availableTypes[0] || "",
    startDate: vacation.startDate || "",
    endDate: vacation.endDate || "",
    status: vacation.status || availableStatuses[0] || "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const savePromise = fetch(`/api/vacations/${vacation.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vacationType: formData.vacationType,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
      }),
    }).then(async (response) => {
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || "Failed to update vacation");
      }
      return result;
    });

    try {
      await toast.promise(savePromise, {
        loading: "Zapisywanie zmian...",
        success: "Zmiany zostały zapisane!",
        error: (err) => `Błąd: ${err.message}`,
      });

      onClose(true); // Pass true to trigger refresh
      router.refresh();
    } catch (error) {
      console.error("Error updating vacation:", error);
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title="Edytuj wniosek urlopowy"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Pracownik"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          disabled
        />
        <CustomSelect
          label="Typ nieobecności *"
          name="vacationType"
          value={formData.vacationType}
          onChange={handleChange}
          options={availableTypes}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Data rozpoczęcia *"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            max={formData.endDate || undefined}
            required
          />
          <CustomInput
            label="Data zakończenia *"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || undefined}
            required
          />
        </div>
        {hasFullAccess ? (
          <CustomSelect
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={availableStatuses}
            required
          />
        ) : (
          <CustomInput
            label="Status"
            name="statusDisplay"
            value={formData.status}
            disabled
          />
        )}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" onClick={() => onClose()} variant="secondary">
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
