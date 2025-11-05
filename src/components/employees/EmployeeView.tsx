"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { EmployeeEditModal } from "@/components/employees/EmployeeEditModal";
import type { EmployeeListItem } from "@/dataBase/query/listEmployeesFromDb";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { EmploymentType } from "@/types/EmploymentType";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  supervisor: string;
  salaryRate: string;
  vacationDays: number;
  contractType: string;
  history: string[];
}

interface EmployeeViewProps {
  initialEmployees: Employee[];
  employeesData: EmployeeListItem[];
  availableEmploymentTypes: EmploymentType[];
  supervisors: SupervisorListItem[];
}

export function EmployeeView({
  initialEmployees,
  employeesData,
  availableEmploymentTypes,
  supervisors,
}: EmployeeViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [employeesRawData, setEmployeesRawData] =
    useState<EmployeeListItem[]>(employeesData);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    initialEmployees[0] || null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Update local state when props change (after router.refresh())
  useEffect(() => {
    setEmployees(initialEmployees);
    setEmployeesRawData(employeesData);

    // Update selected employee with fresh data
    if (selectedEmployee) {
      const updatedSelected = initialEmployees.find(
        (e) => e.id === selectedEmployee.id,
      );
      if (updatedSelected) {
        setSelectedEmployee(updatedSelected);
      }
    }
  }, [initialEmployees, employeesData, selectedEmployee]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

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
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <CustomInput
            type="text"
            name="searchEmployee"
            placeholder="Szukaj pracownika..."
            className="pl-10"
            hideLabel
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
            onClick={() => setIsEditModalOpen(true)}
            disabled={!selectedEmployee}
          >
            Edytuj dane
          </Button>
        </div>
      </div>

      {/* Edit modal */}
      {isEditModalOpen && selectedEmployee && (
        <EmployeeEditModal
          employee={
            employeesRawData.find((e) => e.id === selectedEmployee.id) ||
            employeesRawData[0]
          }
          onClose={(shouldRefresh) => {
            setIsEditModalOpen(false);
            if (shouldRefresh) {
              router.refresh();
            }
          }}
          availableEmploymentTypes={availableEmploymentTypes}
          supervisors={supervisors}
        />
      )}

      <div className="md:col-span-2">
        {selectedEmployee ? (
          <div className="space-y-4">
            {/* Podstawowe informacje - kafelka */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/50">
              <div className="flex items-center mb-4">
                <FaUserCircle className="text-blue-500 text-5xl mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedEmployee.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 min-w-[120px]">
                      Stanowisko:
                    </span>
                    <span className="text-gray-800">
                      {selectedEmployee.position}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 min-w-[120px]">
                      Przełożony:
                    </span>
                    <span className="text-gray-800">
                      {selectedEmployee.supervisor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informacje o zatrudnieniu - kafelka */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
                Informacje o zatrudnieniu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">
                    Stawka wynagrodzenia
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedEmployee.salaryRate}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Dni urlopowe</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedEmployee.vacationDays}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Rodzaj umowy</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedEmployee.contractType}
                  </p>
                </div>
              </div>
            </div>

            {/* Historia projektów - nagłówek */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
                Historia projektów i zadań
              </h3>

              {/* Projekty - każdy osobna kafelka */}
              {selectedEmployee.history.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {selectedEmployee.history.map((item, index) => (
                    <div
                      key={`${selectedEmployee.id}-${item}-${index}`}
                      className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                    >
                      <p className="text-gray-800">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500 italic">
                    Brak przypisanych projektów
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/40 backdrop-blur-sm p-12 rounded-lg shadow-md border border-white/50 flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <FaUserCircle className="text-gray-300 text-8xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Wybierz pracownika z listy, aby zobaczyć szczegóły.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
