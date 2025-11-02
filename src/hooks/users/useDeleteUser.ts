import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { UserListItem } from "@/dataBase/query/listUsersFromDb";

export function useDeleteUser() {
  const router = useRouter();

  const deleteUser = async (user: UserListItem) => {
    const deletePromise = (async () => {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Nie udało się usunąć użytkownika");
      }
      return data;
    })();

    await toast.promise(deletePromise as Promise<unknown>, {
      loading: `Usuwanie ${user.email}...`,
      success: `Usunięto ${user.email}`,
      error: (deleteError: unknown) =>
        deleteError instanceof Error
          ? `Błąd·podczas·usuwania·użytkownika${deleteError.message}`
          : "Błąd podczas usuwania użytkownika",
    });

    router.refresh();
  };

  return { deleteUser };
}
