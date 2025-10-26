"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { GoSignOut } from "react-icons/go";
import useUserStore from "@/store/userStore";

interface LogoutButtonProps {
  className?: string;
  fullWidth?: boolean;
}

export default function LogoutButton({
  className,
  fullWidth = true,
}: LogoutButtonProps) {
  const router = useRouter();
  const clearUserProfile = useUserStore((state) => state.clearUserProfile);

  const handleLogout = () => {
    const logoutPromise = signOut({ redirect: false }).then(() => {
      clearUserProfile();
      setTimeout(() => {
        router.push("/");
        router.refresh();
      });
    });

    toast.promise(logoutPromise, {
      loading: "Wylogowywanie...",
      success: "Pomyślnie wylogowano!",
      error: "Błąd podczas wylogowywania.",
    });
  };

  const defaultClassName = `${fullWidth ? "w-full" : ""} bg-red-500/80 backdrop-blur-2xl font-medium px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-500 hover:scale-105 text-white flex items-center justify-center gap-2`;

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className || defaultClassName}
    >
      Wyloguj
      <GoSignOut className="inline-block" />
    </button>
  );
}
