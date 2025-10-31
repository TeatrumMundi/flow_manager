"use client";

import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { UserModal } from "@/app/components/users/UserModal";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import { useBulkDeleteUsers } from "@/hooks/users/useBulkDeleteUsers";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { useRefreshUsers } from "@/hooks/users/useRefreshUsers";
import type { EmploymentType } from "@/types/EmploymentType";
import type { UserRoles } from "@/types/UserRole";

interface UsersTableProps {
  initialUsers: UserListItem[];
  roleTypes: UserRoles[];
  availableEmploymentTypes: EmploymentType[];
  supervisors: SupervisorListItem[];
}

export function UsersTable({
  initialUsers,
  roleTypes: availableRoles,
  availableEmploymentTypes,
  supervisors,
}: UsersTableProps) {
  const { deleteUser } = useDeleteUser();
  const { bulkDeleteUsers } = useBulkDeleteUsers();
  const { isRefreshing, refreshUsersList, refreshUsersWithToast } =
    useRefreshUsers();

  // Users state management
  const [users, setUsers] = useState(initialUsers);

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

  // Handle refresh with toast
  const handleRefreshUsers = async () => {
    const data = await refreshUsersWithToast();
    if (data) {
      setUsers(data);
    }
  };

  // Handle silent refresh
  const handleSilentRefresh = useCallback(async () => {
    const data = await refreshUsersList();
    if (data) {
      setUsers(data);
    }
  }, [refreshUsersList]);

  // Refresh users list on component mount
  useEffect(() => {
    handleSilentRefresh();
  }, [handleSilentRefresh]);

  // Apply filters whenever search term, role, employment type, or users change
  useEffect(() => {
    let filteredList = users;

    // Filter by selected role
    if (selectedRole !== "Wszystkie") {
      filteredList = filteredList.filter(
        (user) => user.roleName === selectedRole,
      );
    }

    // Filter by selected employment type
    if (selectedEmploymentType !== "Wszystkie") {
      filteredList = filteredList.filter(
        (user) => user.employmentType === selectedEmploymentType,
      );
    }

    // Filter by search term (name or email)
    if (searchTerm) {
      filteredList = filteredList.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredUsers(filteredList);
  }, [searchTerm, selectedRole, selectedEmploymentType, users]);

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
    try {
      await deleteUser(user);
      await handleSilentRefresh();
    } catch (error) {
      console.error("Delete user failed:", error);
    }
  };

  // Delete multiple users using the bulk delete hook
  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await bulkDeleteUsers(selectedUsers);
      setSelectedUsers([]); // Clear selection after successful delete
      await handleSilentRefresh();
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  // Close modal and reset state
  const handleCloseModal = async (shouldRefresh = false) => {
    setModalState({
      isOpen: false,
      mode: "add",
      user: null,
    });

    if (shouldRefresh) {
      await handleSilentRefresh();
    }
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
        <div className="flex gap-4">
          {/* Add user button */}
          <button
            type="button"
            onClick={handleAddUser}
            className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow cursor-pointer whitespace-nowrap"
          >
            <FaPlus className="mr-2" /> Dodaj użytkownika
          </button>

          {/* Refresh button */}
          <button
            type="button"
            title="Odśwież listę użytkowników"
            onClick={handleRefreshUsers}
            disabled={isRefreshing}
            className="flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoMdRefresh
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />{" "}
            Odśwież
          </button>
        </div>

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
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>

        {/* Bulk delete button - shown only when users are selected */}
        {selectedUsers.length > 0 && (
          <button
            type="button"
            onClick={handleBulkDeleteUsers}
            className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow cursor-pointer"
          >
            <FaTrash className="mr-2" /> Usuń zaznaczone ({selectedUsers.length}
            )
          </button>
        )}
      </div>

      {/* Users table */}
      <div className="overflow-x-auto bg-white/50 rounded-lg shadow">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-12" />
            <col className="w-40" />
            <col className="w-32" />
            <col className="w-64" />
            <col className="w-40" />
            <col className="w-25" />
          </colgroup>
          <thead className="bg-blue-600/50">
            <tr className="h-10">
              {/* Select all checkbox */}
              <th className="p-4 border-r border-blue-600/20">
                <div className="flex items-center justify-center h-full">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th className="p-2 pl-6 font-semibold text-gray-600">Imię</th>
              <th className="p-2 font-semibold text-gray-600">Nazwisko</th>
              <th className="p-2 font-semibold text-gray-600">Email</th>
              <th className="p-2 font-semibold text-gray-600">Rola</th>

              <th className="p-2 font-semibold text-gray-600 text-center border-l border-blue-600/20">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              return (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 hover:bg-gray-50/50"
                >
                  {/* Individual row checkbox */}
                  <td className="p-4 border-r border-blue-600/20">
                    <div className="flex items-center justify-center h-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </div>
                  </td>
                  <td className="p-2 pl-6 text-gray-800 truncate">
                    {user.firstName}
                  </td>
                  <td className="p-2 text-gray-800 truncate">
                    {user.lastName}
                  </td>
                  <td className="p-2 text-gray-700 truncate">{user.email}</td>
                  <td className="p-2">
                    <span className="block truncate px-2 py-1 text-sm font-medium text-blue-800 rounded-full">
                      {user.roleName || "Brak roli"}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="p-2 border-l border-blue-600/20">
                    <div className="flex justify-center gap-2">
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
