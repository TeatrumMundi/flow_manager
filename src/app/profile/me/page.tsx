import { UserProfile } from "@/app/profile/me/userProfile";
import { auth } from "@/auth";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/getFullUserProfileFromDbByEmail";

export default async function UserDashboard() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const userProfile = await getFullUserProfileFromDbByEmail(session.user.email);

  if (!userProfile) return null;

  return <UserProfile userProfileData={userProfile} />;
}
