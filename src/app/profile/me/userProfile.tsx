"use client";
import { useEffect } from "react";
import { TopBar } from "@/app/components/userProfile/TopBar";
import useUserStore from "@/store/userStore";
import type { FullUserProfile } from "@/types/interfaces";
import { TilesGrid } from "./tilesGrid";

interface UserProfileProps {
  userProfileData: FullUserProfile;
}

export function UserProfile({ userProfileData }: UserProfileProps) {
  const setUserProfile = useUserStore((state) => state.setUserProfile);

  useEffect(() => {
    if (userProfileData) {
      setUserProfile(userProfileData);
    }
  }, [userProfileData, setUserProfile]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Top bar */}
      <TopBar />

      {/* Tiles grid */}
      <TilesGrid />
    </main>
  );
}
