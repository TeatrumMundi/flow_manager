"use server";

import { signIn } from "@/auth";

export async function signInAction(formData: FormData) {
  return signIn("credentials", formData);
}
