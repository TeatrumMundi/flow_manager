import { auth } from "@/Authentication/auth";
import { redirect } from "next/navigation";

// Server component: redirect /profile -> /profile/[user]
interface User {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

export default async function ProfileRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    // Not authenticated -> back to login
    redirect("/");
  }

  const user = session.user as User;
  // Prefer a stable user id; fallback to email
  const userId = user.id || user.email;

  if (!userId) {
    // Missing identifier; fail safe to home
    redirect("/");
  }

  redirect(`/profile/${encodeURIComponent(String(userId))}`);
}
