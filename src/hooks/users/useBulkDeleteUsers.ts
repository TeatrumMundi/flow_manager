import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useBulkDeleteUsers() {
  const router = useRouter();

  const bulkDeleteUsers = async (userIds: number[]) => {
    const deletePromise = (async () => {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Nie udało się usunąć użytkowników");
      }
      return data;
    })();

    await toast.promise(
      deletePromise as Promise<{
        data: { deletedCount: number; emails: string[] };
      }>,
      {
        loading: `Usuwanie ${userIds.length} użytkowników...`,
        success: (result) =>
          `Usunięto ${result.data.deletedCount} użytkowników`,
        error: (deleteError: unknown) =>
          deleteError instanceof Error
            ? `Błąd podczas usuwania użytkowników: ${deleteError.message}`
            : "Błąd podczas usuwania użytkowników",
      },
    );

    router.refresh();
  };

  return { bulkDeleteUsers };
}
