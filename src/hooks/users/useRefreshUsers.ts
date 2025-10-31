import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function useRefreshUsers() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh users from API (silent refresh without toast)
  const refreshUsersList = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result.ok && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh users:", error);
      return null;
    }
  }, []);

  // Refresh users from API (with toast notification)
  const refreshUsersWithToast = useCallback(async () => {
    setIsRefreshing(true);

    const refreshPromise = fetch("/api/users").then(async (response) => {
      const result = await response.json();
      if (result.ok && result.data) {
        return result.data;
      }
      throw new Error("Nie udało się pobrać danych");
    });

    const data = await toast
      .promise(
        refreshPromise,
        {
          loading: "Odświeżanie listy użytkowników...",
          success: (data) => `Odświeżono listę (${data.length} użytkowników)`,
          error: "Błąd podczas odświeżania listy",
        },
        {
          style: {
            minWidth: "250px",
          },
        },
      )
      .finally(() => {
        setIsRefreshing(false);
      });

    return data;
  }, []);

  return {
    isRefreshing,
    refreshUsersList,
    refreshUsersWithToast,
  };
}
