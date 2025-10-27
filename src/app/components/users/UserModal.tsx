"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

interface UserModalProps {
  mode: "add" | "edit";
  user: UserListItem | null;
  onClose: () => void;
  availableRoles: string[];
  availableEmploymentTypes: string[];
}

export function UserModal({
  mode,
  user,
  onClose,
  availableRoles,
  availableEmploymentTypes,
}: UserModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Initialize form data with defaults or user data in edit mode
  const [formData, setFormData] = useState(() => {
    const defaults = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: availableRoles[0] || "Użytkownik",
      position: "",
      employment_type: availableEmploymentTypes[0] || "Full-time",
      salary_rate: "",
      vacation_days_total: "26",
    };

    // Populate form with existing user data in edit mode
    if (mode === "edit" && user) {
      return {
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.email,
        password: "",
        role: user.roleName || defaults.role,
        position: user.position || "",
        employment_type: user.employmentType || defaults.employment_type,
        salary_rate: "",
        vacation_days_total: "26",
      };
    }
    return defaults;
  });

  // Handle input changes for all form fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClose();
  };

  // Render modal using portal to ensure proper z-index stacking
  return createPortal(
    // Modal backdrop overlay
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyUp={(event) => {
        // Only close if Escape is pressed and the backdrop itself has focus
        if (event.key === "Escape" && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal content container */}
      <div
        role="document"
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 m-4 max-h-[90vh] overflow-y-auto border-2 border-blue-600"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Modal title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === "add" ? "Dodaj nowego użytkownika" : "Edytuj użytkownika"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Imię *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <FormInput
              label="Nazwisko *"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          {/* Email field */}
          <FormInput
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password field - optional in edit mode */}
          <FormInput
            label={mode === "add" ? "Hasło *" : "Nowe hasło"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Role and employment type fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Rola *"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={availableRoles}
            />
            <FormSelect
              label="Typ zatrudnienia *"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              options={availableEmploymentTypes}
            />
          </div>

          {/* Position field */}
          <FormInput
            label="Stanowisko *"
            name="position"
            value={formData.position}
            onChange={handleChange}
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
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {mode === "add" ? "Dodaj użytkownika" : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
