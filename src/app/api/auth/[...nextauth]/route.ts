import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const handler = NextAuth({
  session: {
      strategy: "jwt",
  },

  pages: {
      signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
          email: {},
          password: {},
      },
      async authorize(credentials, req) {

        // const passwordCorrect = await compare(
        //     credentials?.password || "",
        //     user.password
        // );

        //for test
        const passwordCorrect = 1;

        if (passwordCorrect) {
            return {
                id: 'user.id',
                email: 'user.email',
            };
        }
        console.log("credentials", credentials);
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };