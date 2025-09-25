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
          credentials.password as string,
        );
        if (!user) throw new Error("Invalid credentials.");

        // Return minimal, safe user object; extra data should be fetched on demand
        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
  // Redirect unauthenticated users to the root login page
  pages: { signIn: "/" },
  callbacks: {
    // Allow access only when a user session exists.
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
