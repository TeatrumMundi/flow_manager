import { auth } from "@/auth";
import { UserProfile } from "@/components/userProfile/UserProfile";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";

export default async function UserDashboard() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const userProfile = await getFullUserProfileFromDbByEmail(session.user.email);

  if (!userProfile) return null;

  return <UserProfile userProfileData={userProfile} />;
}
