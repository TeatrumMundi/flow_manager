"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";
import type { WorkLog } from "./WorkTimeView";

interface WorkTimeEditModalProps {
  workLog: WorkLog;
  onClose: (shouldRefresh?: boolean) => void;
  availableEmployees: { label: string; value: string }[];
  projectTasksMap: Record<string, { label: string; value: string }[]>;
  userProjectsMap: Record<string, { label: string; value: string }[]>;
}

export function WorkTimeEditModal({
  workLog,
  onClose,
  availableEmployees,
  projectTasksMap,
  userProjectsMap,
}: WorkTimeEditModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeName: workLog.userId ? String(workLog.userId) : "",
    projectName: workLog.projectId ? String(workLog.projectId) : "",
    taskName: workLog.taskId ? String(workLog.taskId) : "",
    date: workLog.date || "",
    hours: workLog.hours.toString(),
    isOvertime: workLog.isOvertime,
    note: workLog.note || "",
  });

  const [availableTasks, setAvailableTasks] = useState<
    { label: string; value: string }[]
  >([]);

  const [filteredProjects, setFilteredProjects] = useState<
    { label: string; value: string }[]
  >([]);

  // Update filtered projects when employee changes
  useEffect(() => {
    if (formData.employeeName && userProjectsMap[formData.employeeName]) {
      setFilteredProjects(userProjectsMap[formData.employeeName]);
      // Reset project and task selection if current project is not in the new list
      const projectIds = userProjectsMap[formData.employeeName].map(
        (p) => p.value,
      );
      if (formData.projectName && !projectIds.includes(formData.projectName)) {
        setFormData((prev) => ({ ...prev, projectName: "", taskName: "" }));
      }
    } else {
      setFilteredProjects([]);
      setFormData((prev) => ({ ...prev, projectName: "", taskName: "" }));
    }
  }, [formData.employeeName, userProjectsMap, formData.projectName]);

  // Update tasks when project changes
  useEffect(() => {
    if (formData.projectName && projectTasksMap[formData.projectName]) {
      setAvailableTasks(projectTasksMap[formData.projectName]);
    } else {
      setAvailableTasks([]);
    }
  }, [formData.projectName, projectTasksMap]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isOvertime: event.target.checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const savePromise = async () => {
      const response = await fetch(`/api/work-logs/${workLog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(formData.employeeName),
          taskId: formData.taskName ? Number(formData.taskName) : null,
          projectId: Number(formData.projectName),
          date: formData.date,
          hoursWorked: formData.hours,
          isOvertime: formData.isOvertime,
          note: formData.note || null,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to update work log");
      }

      return data;
    };

    await toast.promise(savePromise(), {
      loading: "Zapisywanie zmian...",
      success: "Wpis został zaktualizowany!",
      error: (err) => `Błąd: ${err.message}`,
    });

    onClose(true); // Pass true to trigger refresh
    router.refresh();
  };

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title="Edytuj wpis czasu pracy"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomSelect
          label="Pracownik *"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          options={availableEmployees}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            label="Projekt *"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            options={filteredProjects}
            required
          />
          <CustomSelect
            label="Zadanie *"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            options={availableTasks}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <CustomInput
            label="Data *"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <CustomInput
            label="Liczba godzin *"
            name="hours"
            type="number"
            step="0.5"
            value={formData.hours}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="editIsOvertime"
            name="isOvertime"
            checked={formData.isOvertime}
            onChange={handleCheckboxChange}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="editIsOvertime"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Czy nadgodziny
          </label>
        </div>

        <CustomInput
          label="Opis"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />

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
