"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomModal } from "@/components/common/CustomModal";
import { CustomSelect } from "@/components/common/CustomSelect";

interface ProjectAddModalProps {
    onClose: () => void;
    availableStatuses: string[];
    availableManagers: string[];
}

export function ProjectAddModal({
                                    onClose,
                                    availableStatuses,
                                    availableManagers,
                                }: ProjectAddModalProps) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        status: availableStatuses[0] || "",
        manager: availableManagers[0] || "",
        progress: "0",
        budget: "",
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
            console.log("Tworzenie projektu:", formData);
            setTimeout(resolve, 1000);
        });

        await toast.promise(savePromise, {
            loading: `Tworzenie projektu: ${formData.name}...`,
            success: `Utworzono projekt: ${formData.name}!`,
            error: "Błąd podczas tworzenia projektu.",
        });

        onClose();
        router.refresh();
    };

    return (
        <CustomModal
            isOpen={true}
            onClose={onClose}
            title="Dodaj nowy projekt"
            size="md"
        >
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
                        Dodaj projekt
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}