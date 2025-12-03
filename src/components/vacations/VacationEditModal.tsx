"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { Vacation } from "./VacationsView";

interface VacationDaysInfo {
  vacationDaysRemaining: number;
}

interface VacationEditModalProps {
  vacation: Vacation;
  onClose: (shouldRefresh?: boolean) => void;
  availableEmployees: { label: string; value: number | string }[];
  availableTypes: string[];
  availableStatuses: string[];
  hasFullAccess?: boolean;
  currentUserId?: number;
}

// Helper function to calculate business days (excluding weekends)
function calculateBusinessDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  if (start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
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

  const [vacationDaysInfo, setVacationDaysInfo] =
    useState<VacationDaysInfo | null>(null);
  const [isLoadingDaysInfo, setIsLoadingDaysInfo] = useState(false);

  // Calculate original vacation days (to exclude from used balance)
  const originalDays = calculateBusinessDays(
    vacation.startDate,
    vacation.endDate,
  );
  const originalIsRegularVacation =
    vacation.vacationType === "Wypoczynkowy" || vacation.vacationType === "Na żądanie";

  // Calculate days for the new date range
  const requestedDays = calculateBusinessDays(
    formData.startDate,
    formData.endDate,
  );

  // Check if this is a "Wypoczynkowy" or "Na żądanie" type (regular vacation that counts against balance)
  const isRegularVacation = formData.vacationType === "Wypoczynkowy" || formData.vacationType === "Na żądanie";

  // Calculate remaining days after this vacation
  // We need to account for the original vacation days if it was also regular vacation
  const adjustedRemaining = vacationDaysInfo
    ? vacationDaysInfo.vacationDaysRemaining +
      (originalIsRegularVacation ? originalDays : 0)
    : null;

  const remainingAfterVacation =
    adjustedRemaining !== null
      ? adjustedRemaining - (isRegularVacation ? requestedDays : 0)
      : null;

  // Check if vacation would result in negative balance
  const wouldResultInNegativeBalance =
    isRegularVacation &&
    remainingAfterVacation !== null &&
    remainingAfterVacation < 0;

  // Fetch vacation days info for the employee
  const fetchVacationDaysInfo = useCallback(async () => {
    if (!vacation.visibleUserId) {
      setVacationDaysInfo(null);
      return;
    }

    setIsLoadingDaysInfo(true);
    try {
      const response = await fetch(
        `/api/vacations/days/${vacation.visibleUserId}`,
      );
      const result = await response.json();
      if (result.ok) {
        setVacationDaysInfo(result.data);
      } else {
        setVacationDaysInfo(null);
      }
    } catch {
      setVacationDaysInfo(null);
    } finally {
      setIsLoadingDaysInfo(false);
    }
  }, [vacation.visibleUserId]);

  useEffect(() => {
    fetchVacationDaysInfo();
  }, [fetchVacationDaysInfo]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate negative balance for regular vacation
    if (wouldResultInNegativeBalance) {
      toast.error(
        "Nie można zapisać zmian - przekroczono dostępny limit dni urlopowych",
      );
      return;
    }

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

        {/* Vacation Days Info Card - only show for regular vacation */}
        {isRegularVacation && vacationDaysInfo && (
          <div className={`border rounded-lg p-4 ${wouldResultInNegativeBalance ? 'bg-red-50 border-red-300' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              {wouldResultInNegativeBalance ? (
                <FaExclamationTriangle className="text-red-600" />
              ) : (
                <FaCalendarAlt className="text-blue-600" />
              )}
              <span className={`font-semibold ${wouldResultInNegativeBalance ? 'text-red-800' : 'text-blue-800'}`}>
                Dostępne dni urlopowe
              </span>
            </div>
            {isLoadingDaysInfo ? (
              <div className="text-gray-500 text-sm">Ładowanie...</div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {/* Available days tile */}
                <div className="bg-white rounded-lg p-3 shadow-sm text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-blue-600">
                    {adjustedRemaining}
                  </div>
                  <div className="text-xs text-gray-500">dostępne</div>
                </div>
                
                {requestedDays > 0 && (
                  <>
                    {/* Minus sign */}
                    <div className="text-2xl font-bold text-gray-400">−</div>
                    
                    {/* Requested days tile */}
                    <div className="bg-white rounded-lg p-3 shadow-sm text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-orange-500">
                        {requestedDays}
                      </div>
                      <div className="text-xs text-gray-500">wybrane</div>
                    </div>
                    
                    {/* Equals sign */}
                    <div className="text-2xl font-bold text-gray-400">=</div>
                    
                    {/* Remaining days tile */}
                    <div className={`rounded-lg p-3 shadow-sm text-center min-w-[70px] ${remainingAfterVacation !== null && remainingAfterVacation < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <div className={`text-2xl font-bold ${remainingAfterVacation !== null && remainingAfterVacation < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {remainingAfterVacation}
                      </div>
                      <div className="text-xs text-gray-500">pozostanie</div>
                    </div>
                  </>
                )}
              </div>
            )}
            {wouldResultInNegativeBalance && (
              <div className="mt-3 text-sm text-red-600 font-medium text-center">
                Przekroczono limit dni urlopowych!
              </div>
            )}
          </div>
        )}

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
          <Button
            type="submit"
            variant="primary"
            disabled={wouldResultInNegativeBalance}
          >
            Zapisz zmiany
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
