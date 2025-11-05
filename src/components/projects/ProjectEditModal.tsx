"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";

interface Project {
    id: number;
    name: string;
    status: string;
    manager: string;
    progress: number;
    budget: number;
}

interface ProjectEditModalProps {
    project: Project;
    onClose: () => void;
    availableStatuses: string[];
    availableManagers: string[];
}

export function ProjectEditModal({
                                     project,
                                     onClose,
                                     availableStatuses,
                                     availableManagers,
                                 }: ProjectEditModalProps) {
    const router = useRouter();

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    const [formData, setFormData] = useState({
        name: project.name || "",
        status: project.status || availableStatuses[0] || "",
        manager: project.manager || availableManagers[0] || "",
        progress: project.progress?.toString() || "0",
        budget: project.budget?.toString() || "",
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const savePromise = new Promise((resolve) => {
            console.log("Zapisywanie zmian:", formData);
            setTimeout(resolve, 1000);
        });

        await toast.promise(savePromise, {
            loading: `Aktualizowanie projektu: ${formData.name}...`,
            success: `Zaktualizowano projekt: ${formData.name}!`,
            error: "Błąd podczas aktualizacji.",
        });

        onClose();
        router.refresh();
    };

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                role="document"
                className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8 m-4 max-h-[90vh] overflow-y-auto border-2 border-blue-600"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Edytuj projekt
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <CustomInput
                        label="Nazwa projektu *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomSelect
                            label="Kierownik projektu *"
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                            options={availableManagers}
                            required
                        />
                        <CustomSelect
                            label="Status *"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={availableStatuses}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput
                            label="Postęp (%)"
                            name="progress"
                            type="number"
                            value={formData.progress}
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Budżet"
                            name="budget"
                            type="number"
                            value={formData.budget}
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
            </div>
        </div>,
        document.body,
    );
}