"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { FormInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import type { EmploymentType } from "@/types/EmploymentType";
import type { UserRoles } from "@/types/UserRole";

interface UserModalProps {
  mode: "add" | "edit";
  user: UserListItem | null;
  onClose: (shouldRefresh?: boolean) => void;
  availableRoles: UserRoles[];
  availableEmploymentTypes: EmploymentType[];
  supervisors: SupervisorListItem[];
}

export function UserModal({
  mode,
  user,
  onClose,
  availableRoles,
  availableEmploymentTypes,
  supervisors,
}: UserModalProps) {
  const router = useRouter();

  // Initialize form data with defaults or user data in edit mode
  const [formData, setFormData] = useState(() => {
    const defaultEmploymentTypeId = availableEmploymentTypes[0]?.id || "";

    const defaults = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      // Use role name string for select value; fall back to a sensible default
      role: availableRoles[0]?.name || "Użytkownik",
      position: "",
      employment_type_id: String(defaultEmploymentTypeId),
      salary_rate: "",
      vacation_days_total: "26",
      supervisor_id: "",
    };

    // Populate form with existing user data in edit mode
    if (mode === "edit" && user) {
      // Find employment type ID by name
      const employmentTypeId =
        availableEmploymentTypes.find((et) => et.name === user.employmentType)
          ?.id || defaultEmploymentTypeId;

      return {
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.email,
        password: "",
        confirm_password: "",
        role: user.roleName || defaults.role,
        position: user.position || "",
        employment_type_id: String(employmentTypeId),
        salary_rate: user.salaryRate || "",
        vacation_days_total: user.vacationDaysTotal
          ? String(user.vacationDaysTotal)
          : "26",
        supervisor_id: user.supervisorId ? String(user.supervisorId) : "",
      };
    }
    return defaults;
  });

  // Generate email from first and last name
  const generateEmail = (firstName: string, lastName: string): string => {
    if (!firstName && !lastName) return "";

    const firstLetter = firstName ? firstName.charAt(0).toLowerCase() : "";
    const fullLastName = lastName
      ? lastName.toLowerCase().replace(/\s+/g, "")
      : "";

    if (!firstLetter && !fullLastName) return "";

    return `${firstLetter}${fullLastName}@flow.com`;
  };

  // Handle input changes for all form fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-generate email when first_name or last_name changes (only in add mode)
      if (mode === "add" && (name === "first_name" || name === "last_name")) {
        const firstName = name === "first_name" ? value : prev.first_name;
        const lastName = name === "last_name" ? value : prev.last_name;
        updated.email = generateEmail(firstName, lastName);
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Validate password confirmation when password provided (always in add mode; optional in edit)
    if (
      (mode === "add" || formData.password) &&
      formData.password !== formData.confirm_password
    ) {
      toast.error("Hasła nie są zgodne");
      return;
    }

    const supervisorId = formData.supervisor_id
      ? Number(formData.supervisor_id)
      : null;

    const profileData = {
      firstName: formData.first_name || null,
      lastName: formData.last_name || null,
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

    if (mode === "add") {
      const createPromise = (async () => {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            roleName: formData.role,
            profile: profileData,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Nie udało się utworzyć użytkownika");
        }
        return data;
      })();

      await toast.promise(createPromise, {
        loading: `Tworzenie użytkownika: ${formData.first_name} ${formData.last_name} <${formData.email}>...`,
        success: (resp: {
          data?: {
            user?: { id?: number; email?: string };
            profile?: { firstName?: string; lastName?: string };
          };
        }) => {
          const userResponse = resp?.data?.user;
          const profileData = resp?.data?.profile;
          return `Utworzono użytkownika [ID ${userResponse?.id}] ${profileData?.firstName} ${profileData?.lastName} <${userResponse?.email}>`;
        },
        error: (error: Error) =>
          error?.message || "Błąd podczas tworzenia użytkownika",
      });

      onClose(true);
      router.refresh();
      return;
    }

    // Edit mode
    if (mode === "edit" && user) {
      const updatePromise = (async () => {
        const res = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password || undefined,
            roleName: formData.role,
            profile: profileData,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(
            data?.error || "Nie udało się zaktualizować użytkownika",
          );
        }
        return data;
      })();

      await toast.promise(updatePromise, {
        loading: `Aktualizowanie użytkownika: ${formData.first_name} ${formData.last_name} <${formData.email}>...`,
        success: (resp: {
          data?: {
            user?: { id?: number; email?: string };
            profile?: { firstName?: string; lastName?: string };
          };
        }) => {
          const userResponse = resp?.data?.user;
          const profileData = resp?.data?.profile;
          return `Zaktualizowano użytkownika [ID ${userResponse?.id}] ${profileData?.firstName} ${profileData?.lastName} <${userResponse?.email}>`;
        },
        error: (error: Error) =>
          error?.message || "Błąd podczas aktualizacji użytkownika",
      });

      onClose(true);
      router.refresh();
      return;
    }
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={() => onClose(false)}
      title={mode === "add" ? "Dodaj nowego użytkownika" : "Edytuj użytkownika"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Imię *"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Nazwisko *"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email field - auto-generated in add mode, editable in edit mode */}
        {mode === "add" ? (
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </div>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700">
              {formData.email || "@flow.com"}
            </div>
          </div>
        ) : (
          <FormInput
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        )}

        {/* Passwords row: password + confirm password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={mode === "add" ? "Hasło *" : "Nowe hasło"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={mode === "add"}
          />
          <FormInput
            label={
              mode === "add" ? "Potwierdź hasło *" : "Potwierdź nowe hasło"
            }
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            required={mode === "add"}
          />
        </div>

        {/* Role and employment type fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            label="Rola *"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={availableRoles.map((r) => r.name)}
            required
          />
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
        </div>

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

        {/* Position field */}
        <FormInput
          label="Stanowisko *"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />

        {/* Salary and vacation fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Stawka"
            name="salary_rate"
            type="number"
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
            {mode === "add" ? "Dodaj użytkownika" : "Zapisz zmiany"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
