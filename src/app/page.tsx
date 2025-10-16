"use client";

import Image from "next/image";
import Input from "@/app/components/Input";
import { signIn } from "next-auth/react";

export default function Home() {
  const credentialsAction = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    signIn("credentials", { email, password, redirectTo: "/profile/me" });
  };
  return (
    <main className="relative flex items-center justify-center min-h-screen px-4">
      {/* Main content */}
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl shadow-xl p-7 pl-14 pr-14 flex flex-col items-center space-y-8">
        {/* Logo + Title */}
        <div className="flex items-center">
          <Image
            src="/flowIcon.png"
            alt="Flow Manager Logo"
            width={70}
            height={70}
            className="object-contain"
            priority
          />
          <h1 className="text-4xl font-semibold tracking-tight text-gray-700">
            Flow Manager
          </h1>
        </div>

        {/* Login Form */}
        <div className="w-full bg-white/80 rounded-2xl shadow-md p-6 border border-gray-200">
          <form className="space-y-5" action={credentialsAction}>
            {/* Email Input */}
            <Input id="email" type="email" label="Email" name="email" />

            {/* Password Input */}
            <Input
              id="password"
              type="password"
              label="Password"
              name="password"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[1.05] duration-500 cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
