"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { UserModal } from "@/app/components/users/UserModal";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import { useDeleteUser } from "@/hooks/useDeleteUser";

interface UsersTableProps {
  initialUsers: UserListItem[];
  availableRoles: string[];
  availableEmploymentTypes: string[];
  supervisors: SupervisorListItem[];
}

export function UsersTable({
  initialUsers,
  availableRoles,
  availableEmploymentTypes,
  supervisors,
}: UsersTableProps) {
  const { deleteUser } = useDeleteUser();

  // Filter state management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Wszystkie");
  const [selectedEmploymentType] = useState("Wszystkie");
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);

  // Selection state for bulk actions
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Modal state for add/edit operations
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    user: UserListItem | null;
  }>({
    isOpen: false,
    mode: "add",
    user: null,
  });

  // Apply filters whenever search term, role, employment type, or initial users change
  useEffect(() => {
    let users = initialUsers;

    // Filter by selected role
    if (selectedRole !== "Wszystkie") {
      users = users.filter((user) => user.roleName === selectedRole);
    }

    // Filter by selected employment type
    if (selectedEmploymentType !== "Wszystkie") {
      users = users.filter(
        (user) => user.employmentType === selectedEmploymentType,
      );
    }

    // Filter by search term (name or email)
    if (searchTerm) {
      users = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredUsers(users);
  }, [searchTerm, selectedRole, selectedEmploymentType, initialUsers]);

  // Toggle individual user selection
  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  // Toggle select all users
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  // Open modal in add mode
  const handleAddUser = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      user: null,
    });
  };

  // Open modal in edit mode with selected user
  const handleEditUser = (user: UserListItem) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      user,
    });
  };

  // Delete single user using the hook
  const handleDeleteUser = async (user: UserListItem) => {
    await deleteUser(user);
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      user: null,
    });
  };

  return (
    <>
      {/* Render user modal when open */}
      {modalState.isOpen && (
        <UserModal
          mode={modalState.mode}
          user={modalState.user}
          onClose={handleCloseModal}
          availableRoles={availableRoles}
          availableEmploymentTypes={availableEmploymentTypes}
          supervisors={supervisors}
        />
      )}

      {/* Toolbar with filters and actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Add user button */}
        <button
          type="button"
          onClick={handleAddUser}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow cursor-pointer"
        >
          <FaPlus className="mr-2" /> Dodaj użytkownika
        </button>

        {/* Search input */}
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj po imieniu, nazwisku lub emailu..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {/* Role filter dropdown */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="Wszystkie">Wszystkie role</option>
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Bulk delete button - shown only when users are selected */}
        {selectedUsers.length > 0 && (
          <button
            type="button"
            className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow cursor-pointer"
          >
            <FaTrash className="mr-2" /> Usuń zaznaczone ({selectedUsers.length}
            )
          </button>
        )}
      </div>

      {/* Users table */}
      <div className="overflow-x-auto bg-white/50 rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              {/* Select all checkbox */}
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold text-gray-600">
                Imię i nazwisko
              </th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Rola</th>

              <th className="p-4 font-semibold text-gray-600">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              // Construct full name from first and last name
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "Brak danych";

              return (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 hover:bg-gray-50/50"
                >
                  {/* Individual row checkbox */}
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-800">{fullName}</td>
                  <td className="p-4 text-gray-700">{user.email}</td>
                  <td className="py-4 pr-4 pl-2">
                    <span className="px-2 py-1 text-sm font-medium text-blue-800 rounded-full">
                      {user.roleName || "Brak roli"}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => handleEditUser(user)}
                        className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors cursor-pointer border border-blue-200"
                      >
                        <FaEdit size={16} />
                      </button>
                      {/* Delete button */}
                      <button
                        type="button"
                        className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer border border-red-200"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state message */}
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Nie znaleziono użytkowników pasujących do kryteriów.
        </p>
      )}
    </>
  );
}
