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
});
