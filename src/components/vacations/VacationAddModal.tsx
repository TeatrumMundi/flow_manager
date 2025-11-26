"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface VacationAddModalProps {
  onClose: (shouldRefresh?: boolean) => void;
  availableEmployees: { label: string; value: number | string }[];
  availableTypes: string[];
}

export function VacationAddModal({
  onClose,
  availableEmployees,
  availableTypes,
}: VacationAddModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeId: availableEmployees[0]?.value || "",
    vacationType: availableTypes[0] || "",
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

    const savePromise = fetch("/api/vacations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(async (response) => {
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || "Failed to create vacation");
      }
      return result;
    });

    try {
      await toast.promise(savePromise, {
        loading: "Składanie wniosku...",
        success: "Wniosek został złożony!",
        error: (err) => `Błąd: ${err.message}`,
      });

      onClose(true); // Pass true to trigger refresh
      router.refresh();
    } catch (error) {
      console.error("Error creating vacation:", error);
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title="Złóż wniosek urlopowy"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomSelect
          label="Pracownik *"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          options={availableEmployees}
          required
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
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary"
          >
            Anuluj
          </Button>
          <Button type="submit" variant="primary">
            Złóż wniosek
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
