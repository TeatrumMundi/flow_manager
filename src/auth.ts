import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import getUserFromDb from "./dataBase/query/getUserFromDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "Your password",
        },
      },
      authorize: async (credentials) => {
        let user = null;

        user = await getUserFromDb(
          credentials.email as string,
          credentials.password as string,
        );

        console.log("Authorized user:", user);
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // Check if user is trying to access protected routes
      if (pathname.startsWith("/profile")) {
        // If user is not authenticated, return false to redirect to sign-in page
        return !!auth?.user;
      }

      // Allow access to all other routes
      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
});
