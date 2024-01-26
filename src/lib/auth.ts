import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

const Google = GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [Google],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            //console.log("session callback", { session, token });

            if (session.user && token.sub) {
                session.user.id = token.id as string;
            }

            return session;
        },
        jwt: async ({ token, user, account }) => {
            // console.log("JWT callback", { token, user, account });

            if (user?.id) {
                token.id = user.id;
            }
            return token;
        },
    },
});
