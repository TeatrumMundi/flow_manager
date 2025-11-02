"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/common/Button";

interface Employee {
  id: number;
  name: string;
  position: string;
  supervisor: string;
  salaryRate: string;
  vacationDays: number;
  contractType: string;
  history: string[];
}

interface EmployeeViewProps {
  initialEmployees: Employee[];
}

export function EmployeeView({ initialEmployees }: EmployeeViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    initialEmployees[0] || null,
  );

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return initialEmployees;
    }
    return initialEmployees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [initialEmployees, searchTerm]);

  if (
    selectedEmployee &&
    !filteredEmployees.find((e) => e.id === selectedEmployee.id)
  ) {
    setSelectedEmployee(filteredEmployees[0] || null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Lista pracowników
        </h2>

        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj pracownika..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <button
                type="button"
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  selectedEmployee?.id === employee.id
                    ? "bg-blue-100 border border-blue-300 shadow-sm"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <FaUserCircle className="text-blue-500 mr-3" size={24} />
                <span className="font-medium text-gray-800">
                  {employee.name}
                </span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nie znaleziono pracowników.
            </p>
          )}
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => alert("Edycja danych (do implementacji)")}
            disabled={!selectedEmployee}
          >
            Edytuj dane
          </Button>
        </div>
      </div>

      <div className="md:col-span-2 bg-white/20 p-6 rounded-lg shadow-inner">
        {selectedEmployee ? (
          <div>
            <div className="flex flex-col md:flex-row items-center mb-6 text-center md:text-left">
              <FaUserCircle className="text-gray-400 text-6xl md:mr-6 mb-4 md:mb-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedEmployee.name}
                </h2>
                <div className="mt-2 text-lg text-gray-600 space-x-4">
                  <span>
                    <strong>Stanowisko:</strong> {selectedEmployee.position}
                  </span>
                  <span>
                    <strong>Przełożony:</strong> {selectedEmployee.supervisor}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Informacje o zatrudnieniu
                </h3>
                <div className="space-y-2 text-gray-800">
                  <p>
                    <strong>Stawka wynagrodzenia:</strong>{" "}
                    {selectedEmployee.salaryRate}
                  </p>
                  <p>
                    <strong>Liczba dni urlopowych:</strong>{" "}
                    {selectedEmployee.vacationDays}
                  </p>
                  <p>
                    <strong>Rodzaj umowy:</strong>{" "}
                    {selectedEmployee.contractType}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Historia projektów i zadań{" "}
                  <span className="text-sm font-normal text-gray-500">
                    (opcjonalnie)
                  </span>
                </h3>
                {selectedEmployee.history.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedEmployee.history.map((item) => (
                      <li key={`${selectedEmployee.id}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Brak historii.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Wybierz pracownika z listy, aby zobaczyć szczegóły.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
