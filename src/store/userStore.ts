import { create } from "zustand";
import type { FullUserProfile } from "@/types/interfaces";

const useUserStore = create((set) => ({
  userProfile: null,
  setUserProfile: (profile: FullUserProfile) => set({ userProfile: profile }),
  clearUserProfile: () => set({ userProfile: null }),
}));
