"use client";

import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import {
  DataTable,
  type TableAction,
  type TableColumn,
} from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import { UserModal } from "@/components/users/UserModal";
import type { SupervisorListItem } from "@/dataBase/query/listSupervisorsFromDb";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";
import { useRefreshList } from "@/hooks/useRefreshList";
import { useBulkDeleteUsers } from "@/hooks/users/useBulkDeleteUsers";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import type { EmploymentType } from "@/types/EmploymentType";
import type { UserRoles } from "@/types/UserRole";

interface UsersTableProps {
  initialUsers: UserListItem[];
  roleTypes: UserRoles[];
  availableEmploymentTypes: EmploymentType[];
  supervisors: SupervisorListItem[];
}

export function UsersInterface({
  initialUsers,
  roleTypes: availableRoles,
  availableEmploymentTypes,
  supervisors,
}: UsersTableProps) {
  const { deleteUser } = useDeleteUser();
  const { bulkDeleteUsers } = useBulkDeleteUsers();
  const {
    isRefreshing,
    refreshList: refreshUsersList,
    refreshListWithToast: refreshUsersWithToast,
  } = useRefreshList<UserListItem[], UserListItem[]>({ apiUrl: "/api/users" });

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
  const handleSelectUser = (id: string | number) => {
    const numId = typeof id === "string" ? Number(id) : id;
    setSelectedUsers((prev) =>
      prev.includes(numId)
        ? prev.filter((userId) => userId !== numId)
        : [...prev, numId],
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
          <Button variant="primary" onClick={handleAddUser}>
            <FaPlus /> Dodaj użytkownika
          </Button>

          {/* Refresh button */}
          <RefreshButton
            onClick={handleRefreshUsers}
            isRefreshing={isRefreshing}
            title="Odśwież listę użytkowników"
          />
        </div>

        <div className="flex gap-4 flex-1">
          {/* Search input */}
          <div className="relative grow">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
            <CustomInput
              type="text"
              name="searchUsers"
              placeholder="Szukaj po imieniu, nazwisku lub emailu..."
              className="pl-10"
              hideLabel
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {/* Role filter dropdown */}
          <CustomSelect
            name="roleFilter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            hideLabel
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 w-50"
            placeholder="Wszystkie role"
            options={[
              { label: "Wszystkie role", value: "Wszystkie" },
              ...availableRoles.map((role) => ({
                label: role.name,
                value: role.name,
              })),
            ]}
          />
        </div>

        {/* Bulk delete button - shown only when users are selected */}
        {selectedUsers.length > 0 && (
          <Button variant="danger" onClick={handleBulkDeleteUsers}>
            <FaTrash /> Usuń zaznaczone ({selectedUsers.length})
          </Button>
        )}
      </div>

      {/* Users table */}
      <DataTable
        data={filteredUsers}
        keyExtractor={(user) => user.id}
        selectable
        selectedItems={selectedUsers}
        onSelectItem={handleSelectUser}
        onSelectAll={handleSelectAll}
        emptyMessage="Nie znaleziono użytkowników pasujących do kryteriów."
        columns={
          [
            {
              key: "firstName",
              header: "Imię",
              width: "w-25",
              className: "text-gray-800 truncate",
            },
            {
              key: "lastName",
              header: "Nazwisko",
              width: "w-40",
              className: "text-gray-800 truncate",
            },
            {
              key: "email",
              header: "Email",
              width: "w-40",
              className: "text-gray-700 truncate",
            },
            {
              key: "roleName",
              header: "Rola",
              width: "w-25",
              render: (user) => (
                <span className="block truncate px-2 py-1 text-sm font-medium text-blue-800 rounded-full">
                  {user.roleName || "Brak roli"}
                </span>
              ),
            },
          ] as TableColumn<UserListItem>[]
        }
        actions={
          [
            {
              icon: <FaEdit size={16} />,
              label: "Edytuj",
              onClick: handleEditUser,
              variant: "blue",
            },
            {
              icon: <FaTrash size={16} />,
              label: "Usuń",
              onClick: handleDeleteUser,
              variant: "red",
            },
          ] as TableAction<UserListItem>[]
        }
      />
    </>
  );
}
