"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { FormInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { EmployeeListItem } from "@/dataBase/query/listEmployeesFromDb";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { EmploymentType } from "@/types/EmploymentType";

interface EmployeeEditModalProps {
  employee: EmployeeListItem;
  onClose: (shouldRefresh?: boolean) => void;
  availableEmploymentTypes: EmploymentType[];
  supervisors: SupervisorListItem[];
}

export function EmployeeEditModal({
  employee,
  onClose,
  availableEmploymentTypes,
  supervisors,
}: EmployeeEditModalProps) {
  const router = useRouter();

  // Find employment type ID by name
  const employmentTypeId =
    availableEmploymentTypes.find((et) => et.name === employee.employmentType)
      ?.id ||
    availableEmploymentTypes[0]?.id ||
    "";

  // Initialize form data with employee data
  const [formData, setFormData] = useState({
    position: employee.position || "",
    salary_rate: employee.salaryRate || "",
    vacation_days_total: employee.vacationDaysTotal
      ? String(employee.vacationDaysTotal)
      : "26",
    employment_type_id: String(employmentTypeId),
    supervisor_id: employee.supervisorId ? String(employee.supervisorId) : "",
  });

  // Handle input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const supervisorId = formData.supervisor_id
      ? Number(formData.supervisor_id)
      : null;

    const profileData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: formData.position || null,
      employmentTypeId: formData.employment_type_id
        ? Number(formData.employment_type_id)
        : null,
      supervisorId,
      salaryRate:
        formData.salary_rate === "" ? null : String(formData.salary_rate),
      vacationDaysTotal:
        formData.vacation_days_total === ""
          ? null
          : Number(formData.vacation_days_total),
    };

    const updatePromise = (async () => {
      const res = await fetch(`/api/users/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: employee.email,
          roleName: employee.roleName,
          profile: profileData,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error || "Nie udało się zaktualizować pracownika",
        );
      }
      return data;
    })();

    await toast.promise(updatePromise, {
      loading: `Aktualizowanie danych pracownika: ${employee.firstName} ${employee.lastName}...`,
      success: () => {
        return `Zaktualizowano dane pracownika ${employee.firstName} ${employee.lastName}`;
      },
      error: (error: Error) =>
        error?.message || "Błąd podczas aktualizacji danych pracownika",
    });

    onClose(true);
    router.refresh();
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={() => onClose(false)}
      title="Edytuj dane pracownika"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Dane pracownika
          </h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Imię i nazwisko:</strong> {employee.firstName}{" "}
              {employee.lastName}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Rola:</strong> {employee.roleName || "Brak roli"}
            </p>
          </div>
        </div>

        {/* Editable fields */}
        <FormInput
          label="Stanowisko *"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />

        {/* Supervisor field */}
        <CustomSelect
          label="Przełożony"
          name="supervisor_id"
          value={formData.supervisor_id}
          onChange={handleChange}
          options={[
            { label: "Brak", value: "" },
            ...supervisors.map((s) => ({
              label: `${[s.firstName, s.lastName].filter(Boolean).join(" ") || s.email} (${s.email})`,
              value: s.id,
            })),
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Stawka wynagrodzenia"
            name="salary_rate"
            type="number"
            step="0.01"
            value={formData.salary_rate}
            onChange={handleChange}
          />
          <FormInput
            label="Dni urlopu *"
            name="vacation_days_total"
            type="number"
            value={formData.vacation_days_total}
            onChange={handleChange}
            required
          />
        </div>

        <CustomSelect
          label="Typ zatrudnienia *"
          name="employment_type_id"
          value={formData.employment_type_id}
          onChange={handleChange}
          options={availableEmploymentTypes.map((et) => ({
            label: `${et.name} (${et.abbreviation})`,
            value: et.id,
          }))}
          required
        />

        {/* Action buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary"
          >
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
