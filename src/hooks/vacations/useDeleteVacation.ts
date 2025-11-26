import toast from "react-hot-toast";
import type { Vacation } from "@/components/vacations/VacationsView";

export function useDeleteVacation() {
  const deleteVacation = async (vacation: Vacation) => {
    if (!vacation?.id) throw new Error("Vacation ID is required");
    try {
      const response = await fetch(`/api/vacations/${vacation.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Błąd podczas usuwania wniosku");
      }
      toast.success(`Usunięto wniosek urlopowy: ${vacation.employeeName}`);
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Błąd podczas usuwania wniosku",
      );
      throw error;
    }
  };

  return { deleteVacation };
}
