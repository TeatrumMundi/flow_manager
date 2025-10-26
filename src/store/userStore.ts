import { create } from "zustand";
import type { FullUserProfile } from "@/types/interfaces";

interface UserStoreState {
  userProfile: FullUserProfile | null;
  setUserProfile: (profile: FullUserProfile) => void;
  clearUserProfile: () => void;
}

const useUserStore = create<UserStoreState>((set) => ({
  userProfile: null,
  setUserProfile: (profile: FullUserProfile) => set({ userProfile: profile }),
  clearUserProfile: () => set({ userProfile: null }),
}));

export default useUserStore;
