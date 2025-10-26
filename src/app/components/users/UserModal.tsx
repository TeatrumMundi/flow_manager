import React, {useState} from "react";

export function UserModal({
                       mode,
                       user,
                       onClose,
                   }: {
    mode: "add" | "edit";
    user: (typeof mockUsers)[0] | null;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState(() => {
        const defaults = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role: "Pracownik",
            team: "Developement",
            position: "",
            employment_type: "Full-time",
            salary_rate: "",
            vacation_days_total: "26",
        };

        if (mode === "edit" && user) {
            const [first_name = "", ...last_name_parts] = user.name.split(" ");
            const last_name = last_name_parts.join(" ");

            return {
                ...defaults,
                first_name,
                last_name,
                email: user.email,
                password: "",
                role: user.role,
                team: user.team,
                position: user.position || "",
                employment_type: user.employment_type || "Full-time",
                salary_rate: user.salary_rate || "",
                vacation_days_total: user.vacation_days_total?.toString() || "26",
            };
        }
        return defaults;
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dane formularza:", formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {mode === "add" ? "Dodaj nowego użytkownika" : "Edytuj użytkownika"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Imię"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Nazwisko"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <FormInput
                        label={mode === "add" ? "Hasło" : "Nowe hasło (opcjonalnie)"}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormSelect
                            label="Rola"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={roles}
                        />
                        <FormSelect
                            label="Zespół"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            options={teams.filter((t) => t !== "Wszystkie")}
                        />
                    </div>

                    <FormInput
                        label="Stanowisko"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormSelect
                            label="Typ zatrudnienia"
                            name="employment_type"
                            value={formData.employment_type}
                            onChange={handleChange}
                            options={employmentTypes}
                        />
                        <FormInput
                            label="Stawka (opcjonalnie)"
                            name="salary_rate"
                            type="number"
                            value={formData.salary_rate}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Dni urlopu"
                            name="vacation_days_total"
                            type="number"
                            value={formData.vacation_days_total}
                            onChange={handleChange}
                        />
                    </div>

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
                            {mode === "add" ? "Zapisz użytkownika" : "Zapisz zmiany"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}