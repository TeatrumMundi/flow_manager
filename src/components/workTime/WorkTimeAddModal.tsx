"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface WorkTimeAddModalProps {
    onClose: () => void;
    availableEmployees: { label: string; value: string }[];
    availableProjects: { label: string; value: string }[];
    projectTasksMap: Record<string, { label: string; value: string }[]>;
}

export function WorkTimeAddModal({
                                     onClose,
                                     availableEmployees,
                                     availableProjects,
                                     projectTasksMap,
                                 }: WorkTimeAddModalProps) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        employeeName: availableEmployees[0]?.value || "",
        projectName: "",
        taskName: "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        isOvertime: false,
        note: "",
    });

    const [availableTasks, setAvailableTasks] = useState<{ label: string; value: string }[]>([]);

    // Update tasks when project changes
    useEffect(() => {
        if (formData.projectName && projectTasksMap[formData.projectName]) {
            setAvailableTasks(projectTasksMap[formData.projectName]);
            // Reset task selection if it doesn't belong to the new project
            setFormData(prev => ({ ...prev, taskName: "" }));
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
        const savePromise = new Promise((resolve) => {
            console.log("Dodawanie wpisu:", formData);
            setTimeout(resolve, 1000);
        });

        await toast.promise(savePromise, {
            loading: "Dodawanie wpisu...",
            success: "Wpis został dodany!",
            error: "Błąd podczas dodawania.",
        });

        onClose();
        router.refresh();
    };

    return (
        <CustomModal
            isOpen={true}
            onClose={onClose}
            title="Dodaj wpis czasu pracy"
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
                        options={availableProjects}
                        placeholder="Wybierz projekt"
                        required
                    />
                    <CustomSelect
                        label="Zadanie *"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        options={availableTasks}
                        placeholder={formData.projectName ? "Wybierz zadanie" : "Najpierw wybierz projekt"}
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
                        id="isOvertime"
                        name="isOvertime"
                        checked={formData.isOvertime}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isOvertime" className="text-sm font-medium text-gray-700 cursor-pointer">
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
                    <Button type="button" onClick={onClose} variant="secondary">
                        Anuluj
                    </Button>
                    <Button type="submit" variant="primary">
                        Dodaj wpis
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}