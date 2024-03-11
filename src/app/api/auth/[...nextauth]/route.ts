import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { supabase } from "@/utils/supabase";

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
        let passwordCorrect = false;
        let {data: user} = await supabase
          .from('users')
          .select("*")
          .eq('email', credentials?.email);
          
        if(user)
          passwordCorrect = await compare(
            credentials?.password || "",
            user[0].password
          );
        
        if (passwordCorrect) {
            return {
                id: user[0].user_id,
                email: user[0].email,
            };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };