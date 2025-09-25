"use server";

import { signOut } from "@/Authentication/auth";

export async function signOutAction() {
  // NextAuth will clear the session and redirect
  return signOut({ redirectTo: "/" });
}
