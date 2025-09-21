"use server";

import { signIn } from "@/Authentication/auth";

export async function signInAction(formData: FormData) {
  // Extract credentials and redirect to the profile landing page
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Email and password are required.");
  }

  // NextAuth will handle the redirect on success
  return signIn("credentials", {
    email,
    password,
    redirectTo: "/profile",
  });
}
