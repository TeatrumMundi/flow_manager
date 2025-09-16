"use server";

import { signIn } from "@/Authentication/auth";

export async function signInAction(formData: FormData) {
  // Forward the form data to the NextAuth signIn server action
  await signIn("credentials", formData);
}
