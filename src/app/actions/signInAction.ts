"use server";

import { signIn } from "@/Authentication/auth";
import { AuthError } from "next-auth";

export async function signInAction(
    prevState: unknown,
    formData: FormData
) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return { error: "Email i hasło są wymagane." };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/profile",
    });

    return {};

  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nieprawidłowy email lub hasło." };
    }
    throw error;
  }
}
