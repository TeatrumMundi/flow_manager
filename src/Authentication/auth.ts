import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import getUserFromDb from "@/DataBase/Query/getUserFromDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Get user from DB and validate password
        const user = await getUserFromDb(
          credentials.email as string,
          credentials.password as string
        );
        if (!user) throw new Error("Invalid credentials.");

        // return user object
        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
  // Redirect unauthenticated users to the root login page
  pages: {
    signIn: "/",
  },
  callbacks: {
    // This is respected by the middleware export to allow/deny access
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Protect the profile area
      const isProfile =
        nextUrl.pathname === "/profile" ||
        nextUrl.pathname.startsWith("/profile/");

      if (isProfile) return isLoggedIn; // only allow when logged in

      return true; // allow other routes
    },
  },
});
