"use server";

import { signOut } from "@/authentication1/auth";

export async function signOutAction() {
  // NextAuth will clear the session and redirect
  return signOut({ redirectTo: "/" });
}
