import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import getUserFromDb from "@/dataBase/query/getUserFromDb";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? Credentials({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "testuser" },
            password: { label: "Password", type: "password" },
          },
          authorize: async (credentials) => {
            // Only allow a hardcoded test user in preview
            if (
              credentials.username === "testuser" &&
              credentials.password === "testpass"
            ) {
              return {
                id: "preview-test-user",
                name: "Preview User",
                email: "preview@example.com",
                image: "https://i.pravatar.cc/150?u=preview@example.com",
              };
            }
            throw new Error("Invalid credentials.");
          },
        })
      : Credentials({
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
