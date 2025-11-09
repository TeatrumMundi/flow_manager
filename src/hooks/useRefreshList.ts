import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

interface UseRefreshListOptions<TApiData, TMappedData = TApiData> {
  apiUrl: string;
  mapResponseData?: (apiData: TApiData) => TMappedData;
}

interface UseRefreshListReturn<TMappedData> {
  isRefreshing: boolean;
  refreshList: () => Promise<TMappedData | null>;
  refreshListWithToast: () => Promise<TMappedData | null>;
}

export function useRefreshList<TApiData = unknown, TMappedData = TApiData>({
  apiUrl,
  mapResponseData,
}: UseRefreshListOptions<
  TApiData,
  TMappedData
>): UseRefreshListReturn<TMappedData> {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Silent refresh without toast notification
  const refreshList = useCallback(async (): Promise<TMappedData | null> => {
    try {
      const response = await fetch(apiUrl);
      const result: ApiResponse<TApiData> = await response.json();

      if (result.ok && result.data) {
        return mapResponseData
          ? mapResponseData(result.data)
          : (result.data as unknown as TMappedData);
      }
      return null;
    } catch (error) {
      console.error(`Failed to refresh list from ${apiUrl}:`, error);
      return null;
    }
  }, [apiUrl, mapResponseData]);

  // Refresh with toast notification
  const refreshListWithToast =
    useCallback(async (): Promise<TMappedData | null> => {
      setIsRefreshing(true);

      const fetchPromise = fetch(apiUrl).then(async (response) => {
        const result: ApiResponse<TApiData> = await response.json();

        if (result.ok && result.data) {
          return mapResponseData
            ? mapResponseData(result.data)
            : (result.data as unknown as TMappedData);
        }
        throw new Error(result.error || "Failed to fetch data");
      });

      try {
        const data = await toast.promise(
          fetchPromise,
          {
            loading: "Odświeżanie listy...",
            success: (fetchedData) =>
              `Odświeżono listę (${Array.isArray(fetchedData) ? fetchedData.length : "?"} elementów)`,
            error: "Błąd podczas odświeżania listy",
          },
          {
            style: { minWidth: "250px" },
          },
        );
        return data;
      } finally {
        setIsRefreshing(false);
      }
    }, [apiUrl, mapResponseData]);

  return {
    isRefreshing,
    refreshList,
    refreshListWithToast,
  };
}
