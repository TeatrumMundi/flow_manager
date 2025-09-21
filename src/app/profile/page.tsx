import { redirect } from "next/navigation";
import { auth } from "@/Authentication/auth";

export default async function ProfileRedirectPage() {
  const session = await auth();

  // Not authenticated -> back to login
  if (!session?.user) redirect("/");

  const user = session.user;
  // Prefer a stable user id; fallback to email
  const userId = user.id || user.email;

  // Missing identifier; fail safe to home
  if (!userId) redirect("/");

  redirect(`/profile/${encodeURIComponent(String(userId))}`);
}
