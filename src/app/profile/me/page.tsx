/**
 * User Profile Page - Displays the current authenticated user's profile dashboard.
 *
 * This is a Server Component with dynamic rendering (no caching) due to
 * authentication requirements - each user sees their own personalized profile.
 */

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { UserProfile } from "@/components/userProfile/UserProfile";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";

// Disable static rendering - page content is user-specific
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Authenticate the current user
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Fetch complete user profile from database
  const userProfile = await getFullUserProfileFromDbByEmail(session.user.email);

  // Redirect if profile not found (edge case - user exists in auth but not in DB)
  if (!userProfile) {
    redirect("/");
  }

  return <UserProfile userProfileData={userProfile} />;
}
