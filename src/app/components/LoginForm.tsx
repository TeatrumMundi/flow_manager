"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Input from "@/app/components/Input";

export default function LoginForm() {
  const router = useRouter();

  const credentialsAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const loginPromise = signIn("credentials", {
      email,
      password,
      redirectTo: "/profile/me",
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        throw new Error("Invalid credentials");
      }
      // Redirect on success after a short delay to show the success toast
      setTimeout(() => {
        router.push("/profile/me");
      });
      return result;
    });

    toast.promise(loginPromise, {
      loading: "Logowanie...",
      success: "Pomyślnie zalogowano!",
      error: "Logowanie nieudane. Proszę sprawdź swoje dane logowania.",
    });
  };

  return (
    <div className="w-full bg-white/80 rounded-2xl shadow-md p-6 border border-gray-200">
      <form className="space-y-5" action={credentialsAction}>
        {/* Email Input */}
        <Input id="email" type="email" label="Email" name="email" />

        {/* Password Input */}
        <Input id="password" type="password" label="Password" name="password" />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[1.05] duration-500 cursor-pointer"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
